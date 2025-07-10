import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { supabase } from '../supabaseClient';

function Blog({ user, onLogout }) {
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState({ content: '', image: '', video: '' });
  const [newComments, setNewComments] = useState({});
  const [isPosting, setIsPosting] = useState(false);

  // useEffect 1: Para obtener las publicaciones iniciales al cargar el componente
  useEffect(() => {
    const fetchPosts = async () => {
      const { data, error } = await supabase
        .from('publicaciones')
        .select('*, usuarios ( username )')
        .order('creado_en', { ascending: false });

      if (!error) {
        const formatted = data.map(p => ({
          id: p.id,
          content: p.contenido,
          image: p.imagen,
          video: p.video,
          date: new Date(p.creado_en).toLocaleString('es-ES'),
          author: p.usuarios?.username || 'Desconocido',
          comments: [] // Inicializamos los comentarios como un array vacío
        }));
        setPosts(formatted);
      }
    };

    fetchPosts();
  }, []); // Este efecto se ejecuta solo una vez al montar el componente

  // useEffect 2: Para obtener los comentarios y adjuntarlos a las publicaciones
  // Este es el que causaba el warning y ha sido corregido
  useEffect(() => {
    const fetchComentariosForPosts = async () => {
      // Solo intentamos buscar comentarios si ya tenemos publicaciones cargadas
      if (posts.length === 0) return;

      const { data, error } = await supabase
        .from('comentarios')
        .select('*, usuarios ( username )')
        .order('creado_en', { ascending: true });

      if (!error && data.length > 0) {
        const agrupados = {};
        data.forEach(c => {
          const pubId = c.id_publicacion;
          if (!agrupados[pubId]) agrupados[pubId] = [];
          agrupados[pubId].push({
            id: c.id,
            author: c.usuarios?.username || 'Anónimo',
            text: c.contenido
          });
        });

        // Usamos una actualización funcional de setPosts para evitar el loop infinito
        // y asegurarnos de que estamos trabajando con el estado más reciente de 'posts'
        setPosts(prevPosts => {
          return prevPosts.map(post => ({
            ...post,
            comments: agrupados[post.id] || []
          }));
        });
      }
    };

    // Llamamos a la función de obtención de comentarios
    fetchComentariosForPosts();

  }, [posts]); // Ahora 'posts' es una dependencia. Esto hará que el efecto se
               // re-ejecute cada vez que el array 'posts' (o su referencia) cambie.
               // La actualización funcional de `setPosts` evita un bucle infinito.


  const handlePostChange = (e) => {
    const { name, value } = e.target;
    setNewPost(prev => ({ ...prev, [name]: value }));
  };

  const handleCommentChange = (postId, value) => {
    setNewComments(prev => ({ ...prev, [postId]: value }));
  };

  const addPost = async (e) => {
    e.preventDefault();
    if (!newPost.content.trim()) return;
    setIsPosting(true);

    const { data, error } = await supabase.from('publicaciones').insert([
      {
        id_usuario: user.id,
        contenido: newPost.content,
        imagen: newPost.image,
        video: newPost.video
      }
    ]).select();

    if (!error && data.length > 0) {
      const nueva = {
        id: data[0].id,
        content: data[0].contenido,
        image: data[0].imagen,
        video: data[0].video,
        date: new Date(data[0].creado_en).toLocaleString('es-ES'),
        author: user.username,
        comments: []
      };
      setPosts([nueva, ...posts]); // Añadimos la nueva publicación al inicio
      setNewPost({ content: '', image: '', video: '' });
    }

    setIsPosting(false);
  };

  const addComment = async (postId) => {
    const texto = newComments[postId]?.trim();
    if (!texto) return;

    const { data, error } = await supabase.from('comentarios').insert([
      {
        id_publicacion: postId,
        id_usuario: user.id,
        contenido: texto
      }
    ]).select();

    if (!error && data.length > 0) {
      // Actualizamos el estado de 'posts' de forma inmutable para añadir el nuevo comentario
      setPosts(prevPosts =>
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              comments: [
                ...post.comments,
                {
                  id: data[0].id,
                  author: user.username,
                  text: texto
                }
              ]
            };
          }
          return post;
        })
      );
      setNewComments(prev => ({ ...prev, [postId]: '' })); // Limpiamos el campo de comentario
    }
  };

  return (
    <div className="blog-app">
      <Navbar user={user} onLogout={onLogout} />

      <div className="blog-container">
        <div className="blog-content">
          <h1 className="blog-title">Comunidad Fitness</h1>

          {user.role === 'admin' && (
            <>
              <div className="admin-notice mb-6 p-4 bg-blue-100 border-l-4 border-blue-500">
                <p className="text-blue-700">Modo administrador: Puedes crear publicaciones.</p>
              </div>

              <form onSubmit={addPost} className="post-form">
                <textarea
                  name="content"
                  value={newPost.content}
                  onChange={handlePostChange}
                  placeholder="Escribe una nueva publicación..."
                  className="post-input"
                  rows="4"
                  required
                />

                <input
                  type="url"
                  name="image"
                  value={newPost.image}
                  onChange={handlePostChange}
                  placeholder="URL de imagen (opcional)"
                  className="media-input"
                />

                <input
                  type="url"
                  name="video"
                  value={newPost.video}
                  onChange={handlePostChange}
                  placeholder="URL de video (opcional)"
                  className="media-input"
                />

                <button type="submit" className="submit-btn" disabled={isPosting}>
                  {isPosting ? 'Publicando...' : 'Publicar'}
                </button>
              </form>
            </>
          )}

          <div className="posts-list">
            {posts.map(post => (
              <div key={post.id} className="post-card">
                <div className="post-header">
                  <div className="author-avatar">{post.author.charAt(0)}</div>
                  <div className="author-info">
                    <p className="author-name">{post.author}</p>
                    <p className="post-date">{post.date}</p>
                  </div>
                </div>

                <p className="post-content">{post.content}</p>

                {post.image && (
                  <div className="post-media">
                    <img src={post.image} alt="Post" className="post-image" />
                  </div>
                )}

                {post.video && (
                  <div className="post-media video-container">
                    <iframe
                      src={post.video.includes('youtube.com') ? post.video.replace('watch?v=', 'embed/') : post.video}
                      title="Video"
                      className="post-video"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    ></iframe>
                  </div>
                )}

                <div className="comments-section">
                  <h3 className="comments-title">Comentarios ({post.comments.length})</h3>
                  <div className="comments-list">
                    {post.comments.map(comment => (
                      <div key={comment.id} className="comment">
                        <div className="comment-avatar">{comment.author.charAt(0)}</div>
                        <div className="comment-content">
                          <p className="comment-author">{comment.author}</p>
                          <p className="comment-text">{comment.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="comment-form">
                    <input
                      type="text"
                      value={newComments[post.id] || ''}
                      onChange={(e) => handleCommentChange(post.id, e.target.value)}
                      placeholder="Escribe un comentario..."
                      className="comment-input"
                    />
                    <button onClick={() => addComment(post.id)} className="comment-btn">
                      Enviar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;
