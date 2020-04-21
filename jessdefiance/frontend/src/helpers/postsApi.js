import axios from "axios";
import queryString from "query-string";

function toRequest(post) {
  const { title, subtitle, slug, category, content, publishAt, backgroundImage, tags, images, published } = post;
  return { title, subtitle, slug, category, content, publish_at: publishAt, background_image: backgroundImage, tags, images, published };
}

function fromResponse(post) {
  const { title, subtitle, slug, category, content, publish_at, background_image, tags, images, published } = post;
  return { title, subtitle, slug, category, content, publishAt: publish_at, backgroundImage: background_image, tags, images, published };
}

export function getPosts(limit, offset, category, search) {
  const query = queryString.stringify({ limit, offset, category, search });

  return axios
    .get(`/api/posts/?expand=images,tags&${query}`)
    .then(response => {
      return response.data.results.map(fromResponse);
    });
}

export function getPost(slug) {
  return axios
    .get(`/api/posts/${slug}/?expand=images,tags`)
    .then(response => fromResponse(response.data));
}

export function addPost(post) {
  return axios
    .post('/api/posts/', toRequest(post))
    .then(response => fromResponse(response.data));
}

export function updatePost(post) {
  const { slug } = post;

  return axios
    .put(`/api/posts/${slug}/`, toRequest(post))
    .then(response => fromResponse(response.data));
}

export function partialUpdatePost(slug, postDelta) {
  return axios
    .patch(`/api/posts/${slug}/`, postDelta)
    .then(response => fromResponse(response.data))
}

export function deletePost(slug) {
  return axios
    .delete(`/api/posts/${slug}/`)
    .then(response => response.data);
}

export function addImage(name, image) {
  const formData = new FormData();
  formData.set("name", name);
  formData.set("image", image);

  const config = { headers: { 'Content-Type': 'multipart/form-data' } };

  return axios
    .post(`/api/images/`, formData, config)
    .then(response => response.data)
}

export function deleteImage(id) {
  return axios
    .delete(`/api/images/${id}/`)
    .then(response => response.data);
}

export function getTags() {
  return axios
    .get(`/api/tags/`)
    .then(response => response.data.results);
}

export function addTag(name) {
  return axios
    .post(`/api/tags/`, { name })
    .then(response => response.data);
}

export function deleteTag(id) {
  return axios
    .delete(`/api/tags/${id}`)
    .then(response => response.data);
}
