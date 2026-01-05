import { getUser } from "../actions/auth";
import { getPairsList } from "../actions/pairs";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface ListPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

export default async function ListPage({ searchParams }: ListPageProps) {
  const user = await getUser();

  if (!user) {
    redirect("/");
  }

  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);

  const { pairs, pagination } = await getPairsList(user.id, currentPage, 25);

  return (
    <div className="container max-w-7xl mx-auto py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Complete List</h1>
          <p className="text-muted-foreground">
            Browse all {pagination.totalItems} pairs of albums and movies
          </p>
        </div>

        {/* List of pairs */}
        <div className="space-y-4">
          {pairs.map((pair) => (
            <Link key={pair.pairNumber} href={`/media/${pair.pairNumber}`}>
              <Card className="hover:bg-accent/50 transition-colors cursor-pointer">
                <CardContent className="p-6">
                  <div className="grid gap-6 md:grid-cols-[auto_1fr_1fr] items-center">
                    {/* Pair Number */}
                    <div className="flex items-center">
                      <div className="text-2xl font-bold text-muted-foreground min-w-16">
                        #{pair.pairNumber}
                      </div>
                    </div>

                    {/* Album */}
                    <div className="flex gap-4 items-center">
                      {/* Album Cover */}
                      {pair.album?.cover_url && (
                        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={pair.album.cover_url}
                            alt={`${pair.album.title} cover`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Album
                          </span>
                          {pair.userAlbum && (
                            <Badge
                              variant={pair.userAlbum.skipped ? "secondary" : "default"}
                              className="text-xs"
                            >
                              {pair.userAlbum.skipped
                                ? "Skipped"
                                : `${pair.userAlbum.rating}★`}
                            </Badge>
                          )}
                        </div>
                        {pair.album ? (
                          <>
                            <h3 className="font-semibold truncate">{pair.album.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {pair.album.artist}
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {pair.album.year}
                              </Badge>
                              {pair.album.genre && (
                                <Badge variant="outline" className="text-xs">
                                  {pair.album.genre}
                                </Badge>
                              )}
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">No album data</p>
                        )}
                      </div>
                    </div>

                    {/* Movie */}
                    <div className="flex gap-4 items-center">
                      {/* Movie Poster */}
                      {pair.movie?.poster_url && (
                        <div className="relative w-24 h-24 flex-shrink-0 overflow-hidden rounded-md">
                          <Image
                            src={pair.movie.poster_url}
                            alt={`${pair.movie.title} poster`}
                            fill
                            className="object-contain"
                          />
                        </div>
                      )}
                      <div className="space-y-2 flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                            Movie
                          </span>
                          {pair.userMovie && (
                            <Badge
                              variant={pair.userMovie.skipped ? "secondary" : "default"}
                              className="text-xs"
                            >
                              {pair.userMovie.skipped
                                ? "Skipped"
                                : `${pair.userMovie.rating}★`}
                            </Badge>
                          )}
                        </div>
                        {pair.movie ? (
                          <>
                            <h3 className="font-semibold truncate">{pair.movie.title}</h3>
                            <p className="text-sm text-muted-foreground truncate">
                              {pair.movie.director}
                            </p>
                            <div className="flex gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">
                                {pair.movie.year}
                              </Badge>
                              {pair.movie.genre && (
                                <Badge variant="outline" className="text-xs">
                                  {pair.movie.genre}
                                </Badge>
                              )}
                              {pair.movie.runtime && (
                                <Badge variant="outline" className="text-xs">
                                  {pair.movie.runtime} min
                                </Badge>
                              )}
                            </div>
                          </>
                        ) : (
                          <p className="text-sm text-muted-foreground">No movie data</p>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                {currentPage > 1 ? (
                  <PaginationPrevious href={`/list?page=${currentPage - 1}`} />
                ) : (
                  <PaginationPrevious
                    href="#"
                    className="pointer-events-none opacity-50"
                  />
                )}
              </PaginationItem>

              {/* Page numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                let pageNum;
                if (pagination.totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= pagination.totalPages - 2) {
                  pageNum = pagination.totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <PaginationItem key={pageNum}>
                    <PaginationLink
                      href={`/list?page=${pageNum}`}
                      isActive={currentPage === pageNum}
                    >
                      {pageNum}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              {pagination.totalPages > 5 && currentPage < pagination.totalPages - 2 && (
                <PaginationItem>
                  <PaginationEllipsis />
                </PaginationItem>
              )}

              <PaginationItem>
                {currentPage < pagination.totalPages ? (
                  <PaginationNext href={`/list?page=${currentPage + 1}`} />
                ) : (
                  <PaginationNext
                    href="#"
                    className="pointer-events-none opacity-50"
                  />
                )}
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
      </div>
    </div>
  );
}
