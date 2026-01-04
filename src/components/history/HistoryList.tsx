"use client";

import { useState } from "react";
import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface HistoryItem {
  id: string;
  rating: number | null;
  skipped: boolean;
  completed_at: string | null;
  notes: string | null;
  created_at: string;
  albums?: any;
  movies?: any;
}

interface HistoryListProps {
  albums: HistoryItem[];
  movies: HistoryItem[];
}

export function HistoryList({ albums, movies }: HistoryListProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "completed" | "skipped">("all");

  const filterItems = (items: HistoryItem[]) => {
    return items.filter((item) => {
      // Filter by completion status
      if (filterType === "completed" && (!item.completed_at || item.skipped)) {
        return false;
      }
      if (filterType === "skipped" && !item.skipped) {
        return false;
      }

      // Filter by search query
      if (searchQuery) {
        const media = item.albums || item.movies;
        const title = media?.title?.toLowerCase() || "";
        const artist = media?.artist?.toLowerCase() || "";
        const director = media?.director?.toLowerCase() || "";
        const query = searchQuery.toLowerCase();

        return (
          title.includes(query) ||
          artist.includes(query) ||
          director.includes(query)
        );
      }

      return true;
    });
  };

  const filteredAlbums = filterItems(albums);
  const filteredMovies = filterItems(movies);

  const renderAlbumCard = (item: HistoryItem) => {
    const album = item.albums;
    if (!album) return null;

    return (
      <Card key={item.id}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            {album.cover_url && (
              <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={album.cover_url}
                  alt={album.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{album.title}</h3>
              <p className="text-sm text-muted-foreground">{album.artist}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline">{album.year}</Badge>
                {album.genre && (
                  <Badge variant="outline">{album.genre}</Badge>
                )}
                {item.skipped ? (
                  <Badge variant="secondary">Skipped</Badge>
                ) : item.rating ? (
                  <Badge>{item.rating}★</Badge>
                ) : null}
              </div>
              {item.notes && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {item.notes}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderMovieCard = (item: HistoryItem) => {
    const movie = item.movies;
    if (!movie) return null;

    return (
      <Card key={item.id}>
        <CardContent className="p-4">
          <div className="flex gap-4">
            {movie.poster_url && (
              <div className="relative h-24 w-16 flex-shrink-0 overflow-hidden rounded-md">
                <Image
                  src={movie.poster_url}
                  alt={movie.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold truncate">{movie.title}</h3>
              <p className="text-sm text-muted-foreground">{movie.director}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <Badge variant="outline">{movie.year}</Badge>
                {movie.genre && (
                  <Badge variant="outline">{movie.genre}</Badge>
                )}
                {movie.runtime && (
                  <Badge variant="outline">{movie.runtime} min</Badge>
                )}
                {item.skipped ? (
                  <Badge variant="secondary">Skipped</Badge>
                ) : item.rating ? (
                  <Badge>{item.rating}★</Badge>
                ) : null}
              </div>
              {item.notes && (
                <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                  {item.notes}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Search by title, artist, or director..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Select value={filterType} onValueChange={(value: any) => setFilterType(value)}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Items</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="skipped">Skipped</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">
            All ({filteredAlbums.length + filteredMovies.length})
          </TabsTrigger>
          <TabsTrigger value="albums">Albums ({filteredAlbums.length})</TabsTrigger>
          <TabsTrigger value="movies">Movies ({filteredMovies.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4 mt-4">
          {[...filteredAlbums, ...filteredMovies]
            .sort((a, b) => {
              const dateA = new Date(a.created_at || 0).getTime();
              const dateB = new Date(b.created_at || 0).getTime();
              return dateB - dateA;
            })
            .map((item) =>
              item.albums ? renderAlbumCard(item) : renderMovieCard(item)
            )}
          {filteredAlbums.length === 0 && filteredMovies.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No items found
            </p>
          )}
        </TabsContent>

        <TabsContent value="albums" className="space-y-4 mt-4">
          {filteredAlbums.map(renderAlbumCard)}
          {filteredAlbums.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No albums found
            </p>
          )}
        </TabsContent>

        <TabsContent value="movies" className="space-y-4 mt-4">
          {filteredMovies.map(renderMovieCard)}
          {filteredMovies.length === 0 && (
            <p className="text-center text-muted-foreground py-8">
              No movies found
            </p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
