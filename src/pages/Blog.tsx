import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowRight, Calendar, Clock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  cover_image: string;
  created_at: string;
  reading_time: number;
  image_width: number;
  image_height: number;
}

export function Blog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [displayedPosts, setDisplayedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const postsPerPage = 6;

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    setDisplayedPosts(posts.slice(0, postsPerPage));
  }, [posts]);

  async function loadPosts() {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col lg:flex-row gap-8">
        <section className="lg:w-3/4 prose lg:prose-lg">
          <motion.h2 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-serif text-nature-500 mb-8"
          >
            Actualités et Articles
          </motion.h2>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nature-500"></div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-8">
              {displayedPosts.map((post) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ y: -5 }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden group border-l-4 border-nature-400"
                >
                  <Link to={`/blog/${post.id}`} className="no-underline">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.cover_image}
                        alt={post.title}
                        className={`w-full ${post.image_width < 800 ? 'object-contain' : 'object-cover'} transform group-hover:scale-105 transition-transform duration-500`}
                        style={{
                          maxWidth: '100%',
                          height: post.image_width < 800 ? 'auto' : '100%'
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-4 text-sm text-nature-400 mb-3">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {format(new Date(post.created_at), 'dd MMMM yyyy', { locale: fr })}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {post.reading_time} min
                        </span>
                      </div>
                      <h3 className="text-xl font-serif text-nature-500 mb-2">{post.title}</h3>
                      <p className="text-nature-500 line-clamp-3">{post.excerpt}</p>
                      <div className="mt-4 flex items-center text-nature-400 group-hover:text-nature-600">
                        <span>Lire la suite</span>
                        <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-2 transition-transform" />
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        <aside className="lg:w-1/4">
          <div className="bg-white rounded-xl shadow-lg p-6 sticky top-4">
            <h3 className="text-xl font-serif text-nature-500 mb-4">Tous les articles</h3>
            <div className="space-y-2">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  to={`/blog/${post.id}`}
                  className="block p-2 hover:bg-nature-50 rounded transition-colors no-underline"
                >
                  <div className="text-sm font-medium text-nature-500">{post.title}</div>
                  <div className="text-xs text-nature-400">
                    {format(new Date(post.created_at), 'dd MMMM yyyy', { locale: fr })}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
}