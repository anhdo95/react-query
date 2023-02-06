import { useMutation, useQuery } from "@tanstack/react-query";

async function fetchComments(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/comments?postId=${postId}`
  );
  return response.json();
}

async function deletePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    { method: "DELETE" }
  );
  return response.json();
}

async function updatePost(postId) {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${postId}`,
    {
      method: "PATCH",
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
      body: JSON.stringify({ title: "REACT QUERY FOREVER!!!!" }),
    }
  );
  return response.json();
}

export function PostDetail({ post }) {
  const { data = [] } = useQuery(["comments", post.id], () =>
    fetchComments(post.id)
  );

  const deleteMutation = useMutation(() => deletePost(post.id));
  const updateMutation = useMutation(() => updatePost(post.id));

  return (
    <>
      <h3 style={{ color: "blue" }}>{post.title}</h3>
      <button
        onClick={() => deleteMutation.mutate()}
        disabled={deleteMutation.isLoading}
      >
        Delete
      </button>{" "}
      <button
        onClick={() => updateMutation.mutate()}
        disabled={updateMutation.isLoading}
      >
        Update title
      </button>
      {deleteMutation.isSuccess && (
        <p style={{ color: "green" }}>The post has been deleted!</p>
      )}
      {updateMutation.isSuccess && (
        <p style={{ color: "green" }}>The post has been updated!</p>
      )}
      <p>{post.body}</p>
      <h4>Comments</h4>
      {data.map((comment) => (
        <li key={comment.id}>
          {comment.email}: {comment.body}
        </li>
      ))}
    </>
  );
}
