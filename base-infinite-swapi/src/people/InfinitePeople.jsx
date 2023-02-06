import { useInfiniteQuery } from "@tanstack/react-query";
import InfiniteScroll from "react-infinite-scroller";
import { Person } from "./Person";

const initialUrl = "https://swapi.dev/api/people/";
const fetchUrl = async (url) => {
  const response = await fetch(url);
  return response.json();
};

export function InfinitePeople() {
  const {
    data,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = useInfiniteQuery({
    queryKey: ["people"],
    queryFn: ({ pageParam = initialUrl }) => fetchUrl(pageParam),
    getNextPageParam: (lastPage) => lastPage.next || undefined,
  });

  if (isLoading) return <div className="loading">Loading...</div>;

  return (
    <>
      {isFetchingNextPage && <div className="loading">Loading...</div>}
      <InfiniteScroll
        loadMore={() => !isFetchingNextPage && fetchNextPage()}
        hasMore={hasNextPage}
        threshold={350}
      >
        {data.pages.map(({ results }) =>
          results.map((person) => (
            <Person
              key={person.name}
              name={person.name}
              eyeColor={person.eye_color}
              hairColor={person.hair_color}
            />
          ))
        )}
      </InfiniteScroll>
    </>
  );
}
