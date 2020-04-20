import axios from "axios";

const authHeader = () => ({
  'Authorization': 'Bearer ' + localStorage.getItem('access-token')
});

export function getPosts(offset, category, searchText) {
  return axios
    .get('/api/posts/')
    .then(response => {
      return response.data.results.map(post => {
        const { title, slug, category, content, publish_at, tags, images } = post;
        return { title, slug, category, content, publishAt: publish_at, tags, images };
      });
    })
    .catch(error => {
      console.log(error);
    })
}

export function getPost(slug) {
  return axios
    .get(`/api/posts/${slug}/`)
    .then(response => {
      const { title, slug, category, content, publish_at, tags, images } = response.data;
      return { title, slug, category, content, publishAt: publish_at, tags, images };
    })
    .catch(error => {
      console.log(error);
    });
}

export function addPost(post) {
  return axios
    .post('/api/posts/', post)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
}

export function updatePost(slug, post) {
  return axios
    .put(`/api/posts/${slug}/`, post)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
}

export function partialUpdatePost(slug, postDelta) {
  return axios
    .patch(`/api/posts/${slug}/`, postDelta)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
}

export function deletePost(slug) {
  return axios
    .delete(`/api/posts/${slug}/`)
    .then(response => {
      console.log(response);
    })
    .catch(error => {
      console.log(error);
    });
}

export function addImage(image) {
  const formData = new FormData();
  formData.set("image", image);
  const config = { headers: { 'Content-Type': 'multipart/form-data' } };

  return axios
    .post(`/api/images/`, formData, config)
    .then(response => response.data)
    .catch(error => console.log(error));
}
