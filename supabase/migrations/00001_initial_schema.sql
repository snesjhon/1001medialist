-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create albums table
create table public.albums (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  artist text not null,
  year integer not null,
  genre text,
  cover_url text,
  spotify_id text,
  list_number integer not null unique check (list_number between 1 and 1001),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create movies table
create table public.movies (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  director text not null,
  year integer not null,
  genre text,
  poster_url text,
  tmdb_id integer,
  runtime integer,
  list_number integer not null unique check (list_number between 1 and 1001),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create profiles table
create table public.profiles (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  current_pair_number integer default 1 check (current_pair_number between 1 and 1001),
  display_name text
);

-- Create user_albums table
create table public.user_albums (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  album_id uuid references public.albums on delete cascade not null,
  completed_at timestamp with time zone,
  rating integer check (rating between 1 and 5),
  skipped boolean default false,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, album_id)
);

-- Create user_movies table
create table public.user_movies (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users on delete cascade not null,
  movie_id uuid references public.movies on delete cascade not null,
  completed_at timestamp with time zone,
  rating integer check (rating between 1 and 5),
  skipped boolean default false,
  notes text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, movie_id)
);

-- Create indexes for better performance
create index idx_albums_list_number on public.albums(list_number);
create index idx_movies_list_number on public.movies(list_number);
create index idx_user_albums_user_id on public.user_albums(user_id);
create index idx_user_movies_user_id on public.user_movies(user_id);
create index idx_profiles_user_id on public.profiles(user_id);

-- Enable Row Level Security
alter table public.albums enable row level security;
alter table public.movies enable row level security;
alter table public.profiles enable row level security;
alter table public.user_albums enable row level security;
alter table public.user_movies enable row level security;

-- RLS Policies for albums (public read)
create policy "Albums are viewable by everyone"
  on public.albums for select
  using (true);

-- RLS Policies for movies (public read)
create policy "Movies are viewable by everyone"
  on public.movies for select
  using (true);

-- RLS Policies for profiles
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = user_id);

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = user_id);

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = user_id);

-- RLS Policies for user_albums
create policy "Users can view their own album entries"
  on public.user_albums for select
  using (auth.uid() = user_id);

create policy "Users can insert their own album entries"
  on public.user_albums for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own album entries"
  on public.user_albums for update
  using (auth.uid() = user_id);

create policy "Users can delete their own album entries"
  on public.user_albums for delete
  using (auth.uid() = user_id);

-- RLS Policies for user_movies
create policy "Users can view their own movie entries"
  on public.user_movies for select
  using (auth.uid() = user_id);

create policy "Users can insert their own movie entries"
  on public.user_movies for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own movie entries"
  on public.user_movies for update
  using (auth.uid() = user_id);

create policy "Users can delete their own movie entries"
  on public.user_movies for delete
  using (auth.uid() = user_id);

-- Function to automatically create a profile on user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (user_id, display_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$;

-- Trigger to create profile on new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
