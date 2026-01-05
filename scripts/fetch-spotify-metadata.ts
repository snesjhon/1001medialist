/**
 * Script to fetch album metadata from Spotify API
 *
 * Usage:
 * 1. Get Spotify credentials from https://developer.spotify.com/dashboard
 * 2. Add to .env.local: SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET
 * 3. Run: npx tsx scripts/fetch-spotify-metadata.ts
 */

import { albumsList, type AlbumSeed } from "./seed-data/albums-list";

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID;
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET;

interface SpotifyAlbum {
  id: string;
  name: string;
  images: { url: string }[];
  genres: string[];
}

interface EnrichedAlbum {
  title: string;
  artist: string;
  year: number;
  list_number: number;
  spotify_id: string | null;
  cover_url: string | null;
  genre: string | null;
}

let accessToken: string | null = null;

async function getAccessToken(): Promise<string> {
  if (!SPOTIFY_CLIENT_ID || !SPOTIFY_CLIENT_SECRET) {
    throw new Error("Spotify credentials not found. Please set SPOTIFY_CLIENT_ID and SPOTIFY_CLIENT_SECRET in .env.local");
  }

  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`).toString("base64")}`,
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

async function searchAlbum(title: string, artist: string): Promise<SpotifyAlbum | null> {
  if (!accessToken) {
    accessToken = await getAccessToken();
  }

  try {
    const query = encodeURIComponent(`album:${title} artist:${artist}`);
    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=album&limit=1`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const data = await response.json();

    if (data.albums?.items && data.albums.items.length > 0) {
      const album = data.albums.items[0];

      // Fetch artist details for genre information
      let genres: string[] = [];
      if (album.artists && album.artists.length > 0) {
        const artistResponse = await fetch(
          `https://api.spotify.com/v1/artists/${album.artists[0].id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        const artistData = await artistResponse.json();
        genres = artistData.genres || [];
      }

      return {
        id: album.id,
        name: album.name,
        images: album.images,
        genres,
      };
    }
    return null;
  } catch (error) {
    console.error(`Error fetching album "${title}" by ${artist}:`, error);
    return null;
  }
}

async function enrichAlbums(): Promise<EnrichedAlbum[]> {
  const enrichedAlbums: EnrichedAlbum[] = [];

  console.log(`Fetching metadata for ${albumsList.length} albums...`);

  for (let i = 0; i < albumsList.length; i++) {
    const album = albumsList[i];
    console.log(`[${i + 1}/${albumsList.length}] Fetching: ${album.title} by ${album.artist}`);

    const spotifyData = await searchAlbum(album.title, album.artist);

    const enriched: EnrichedAlbum = {
      ...album,
      spotify_id: spotifyData?.id || null,
      cover_url: spotifyData?.images && spotifyData.images.length > 0
        ? spotifyData.images[0].url
        : null,
      genre: spotifyData?.genres && spotifyData.genres.length > 0
        ? spotifyData.genres[0]
        : null,
    };

    enrichedAlbums.push(enriched);

    // Rate limiting: wait 100ms between requests
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  return enrichedAlbums;
}

async function main() {
  const enrichedAlbums = await enrichAlbums();

  // Save to JSON file
  const fs = await import("fs/promises");
  await fs.writeFile(
    "./scripts/seed-data/albums-enriched.json",
    JSON.stringify(enrichedAlbums, null, 2)
  );

  console.log("\nDone! Enriched album data saved to albums-enriched.json");
  console.log(`Successfully enriched ${enrichedAlbums.filter(a => a.spotify_id).length}/${enrichedAlbums.length} albums`);
}

if (require.main === module) {
  main();
}
