/**
 * Source: "1001 Albums You Must Hear Before You Die" book
 *
 * This is a sample structure. You'll need to populate this with actual data.
 * Each album should have:
 * - title: The album title
 * - artist: The artist/band name
 * - year: Release year
 * - list_number: Position in the 1001 list (1-1001)
 *
 * The Spotify API will be used to fetch additional metadata like:
 * - spotify_id
 * - cover_url
 * - genre
 */

export interface AlbumSeed {
  title: string;
  artist: string;
  year: number;
  list_number: number;
}

export const albumsList: AlbumSeed[] = [
  // Sample entries - replace with actual 1001 albums
  { title: "Abbey Road", artist: "The Beatles", year: 1969, list_number: 1 },
  { title: "The Dark Side of the Moon", artist: "Pink Floyd", year: 1973, list_number: 2 },
  { title: "Thriller", artist: "Michael Jackson", year: 1982, list_number: 3 },
  { title: "Rumours", artist: "Fleetwood Mac", year: 1977, list_number: 4 },
  { title: "The Joshua Tree", artist: "U2", year: 1987, list_number: 5 },
  // ... add 996 more albums
];
