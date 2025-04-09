import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ArrowLeft, Calendar, Clock } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  cover_image: string;
  created_at: string;
  reading_time: number;
}

export function BlogPost() {
  const { id } = useParams<{ id: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPost() {
      try {
        const { data, error } = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        setPost(data);
      } catch (error) {
        console.error('Error loading post:', error);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadPost();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-nature-500"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-nature-500">Article non trouvé</h2>
          <Link
            to="/blog"
            className="mt-4 inline-flex items-center text-nature-500 hover:text-nature-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux articles
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/blog"
        className="inline-flex items-center text-nature-500 hover:text-nature-600 mb-8"
      >
        <ArrowLeft className="w-4 h-4 mr-2" />
        Retour aux articles
      </Link>

      <article className="prose lg:prose-lg max-w-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-white rounded-xl shadow-lg overflow-hidden border-l-4 border-nature-400"
        >
          <div className="h-96 overflow-hidden">
            <img
              src={post.cover_image}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="p-8">
            <div className="flex items-center gap-4 text-sm text-nature-400 mb-4">
              <span className="flex items-center">
                <Calendar className="w-4 h-4 mr-1" />
                {format(new Date(post.created_at), 'dd MMMM yyyy', { locale: fr })}
              </span>
              <span className="flex items-center">
                <Clock className="w-4 h-4 mr-1" />
                {post.reading_time} min de lecture
              </span>
            </div>

            <h1 className="text-3xl font-serif text-nature-500 mb-8">{post.title}</h1>

            <div
              className="prose lg:prose-lg"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>
        </motion.div>
      </article>
    </main>
  );
}