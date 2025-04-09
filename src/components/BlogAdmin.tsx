import React, { useState, useEffect } from 'react';
import { Upload, Save, Image as ImageIcon, Loader, Trash2, Edit, X, Key } from 'lucide-react';
import { supabase, adminAuth } from '../lib/supabaseClient';
import { TipTapEditor } from './TipTapEditor';
import { ChangePasswordModal } from './ChangePasswordModal';

export function BlogAdmin() {
  const [title, setTitle] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [imageSize, setImageSize] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editorContent, setEditorContent] = useState('');
  const [editingPost, setEditingPost] = useState<any>(null);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
  const session = adminAuth.getSession();

  useEffect(() => {
    loadPosts();
  }, []);

  useEffect(() => {
    if (editingPost) {
      setTitle(editingPost.title);
      setExcerpt(editingPost.excerpt);
      setEditorContent(editingPost.content);
      setPreviewUrl(editingPost.cover_image);
      setImageSize({ width: editingPost.image_width, height: editingPost.image_height });
    }
  }, [editingPost]);

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

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        setImageSize({ width: img.width, height: img.height });
        URL.revokeObjectURL(objectUrl);
      };
      
      img.src = objectUrl;
      
      setCoverImage(file);
      setPreviewUrl(objectUrl);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      return;
    }

    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', postId);

      if (error) throw error;
      
      await loadPosts();
      alert('Article supprimé avec succès !');
    } catch (error) {
      console.error('Error deleting post:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleEdit = (post: any) => {
    setEditingPost(post);
  };

  const cancelEdit = () => {
    setEditingPost(null);
    clearForm();
  };

  const clearForm = () => {
    setTitle('');
    setExcerpt('');
    setEditorContent('');
    setCoverImage(null);
    setPreviewUrl('');
    setImageSize({ width: 0, height: 0 });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editorContent || (!coverImage && !editingPost)) return;

    setSaving(true);
    try {
      let publicUrl = editingPost?.cover_image;

      if (coverImage) {
        const fileExt = coverImage.name.split('.').pop();
        const fileName = `${Date.now()}.${fileExt}`;
        
        const { error: uploadError } = await supabase.storage
          .from('blog-images')
          .upload(fileName, coverImage);

        if (uploadError) throw uploadError;

        const { data: { publicUrl: newUrl } } = supabase.storage
          .from('blog-images')
          .getPublicUrl(fileName);

        publicUrl = newUrl;
      }

      const postData = {
        title,
        content: editorContent,
        excerpt,
        cover_image: publicUrl,
        reading_time: Math.ceil(editorContent.split(' ').length / 200),
        image_width: imageSize.width,
        image_height: imageSize.height,
        updated_at: new Date().toISOString()
      };

      let error;

      if (editingPost) {
        ({ error } = await supabase
          .from('blog_posts')
          .update(postData)
          .eq('id', editingPost.id));
      } else {
        ({ error } = await supabase
          .from('blog_posts')
          .insert([postData]));
      }

      if (error) throw error;

      clearForm();
      setEditingPost(null);
      await loadPosts();
      alert(editingPost ? 'Article mis à jour avec succès !' : 'Article publié avec succès !');
    } catch (error: any) {
      console.error('Error saving post:', error);
      alert(`Erreur lors de la ${editingPost ? 'mise à jour' : 'publication'}: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-serif text-nature-500">Administration du Blog</h2>
        {session && (
          <button
            type="button"
            onClick={() => setIsChangePasswordModalOpen(true)}
            className="flex items-center text-nature-500 hover:text-nature-600 transition-colors"
          >
            <Key className="w-5 h-5 mr-2" />
            Changer le mot de passe
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <form onSubmit={handleSubmit} id="blogForm" className="space-y-6 bg-white p-6 rounded-lg shadow-md">
            {editingPost && (
              <div className="flex items-center justify-between bg-nature-100 p-4 rounded-lg mb-6">
                <span className="text-nature-600 font-medium">
                  Modification de l'article : {editingPost.title}
                </span>
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-nature-500 hover:text-nature-600 p-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-nature-500 mb-2">
                Titre
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-nature-200 focus:ring-2 focus:ring-nature-400 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-nature-500 mb-2">
                Extrait
              </label>
              <textarea
                value={excerpt}
                onChange={(e) => setExcerpt(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-nature-200 focus:ring-2 focus:ring-nature-400 focus:border-transparent"
                rows={3}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-nature-500 mb-2">
                Image de couverture
              </label>
              <div className="flex items-center space-x-4">
                <label className="cursor-pointer bg-nature-100 hover:bg-nature-200 text-nature-500 font-medium py-2 px-4 rounded-lg transition-colors duration-300 flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  {editingPost ? "Changer l'image" : "Choisir une image"}
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    required={!editingPost}
                  />
                </label>
                {previewUrl && (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Aperçu"
                      className="h-20 w-20 object-contain"
                    />
                    <div className="text-xs text-nature-400 mt-1">
                      {imageSize.width}x{imageSize.height}px
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-nature-500 mb-2">
                Contenu
              </label>
              <div className="prose prose-lg max-w-none">
                <TipTapEditor
                  content={editorContent}
                  onChange={setEditorContent}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                form="blogForm"
                disabled={saving}
                className="bg-nature-400 hover:bg-nature-500 text-white font-medium py-2 px-6 rounded-lg transition-colors duration-300 flex items-center"
              >
                {saving ? (
                  <>
                    <Loader className="w-5 h-5 mr-2 animate-spin" />
                    {editingPost ? 'Mise à jour en cours...' : 'Publication en cours...'}
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    {editingPost ? 'Mettre à jour' : 'Publier'}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="lg:w-1/3">
          <div className="bg-white p-6 rounded-lg shadow-md sticky top-4">
            <h3 className="text-xl font-serif text-nature-500 mb-4">Articles publiés</h3>
            <div className="space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between bg-nature-50 p-4 rounded-lg hover:bg-nature-100 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-nature-500 truncate">{post.title}</h4>
                    <p className="text-sm text-nature-400">
                      {new Date(post.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex space-x-2 ml-4">
                    <button
                      type="button"
                      onClick={() => handleEdit(post)}
                      className="text-nature-500 hover:text-nature-600 p-2"
                    >
                      <Edit className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id)}
                      className="text-red-500 hover:text-red-600 p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {session && (
        <ChangePasswordModal
          isOpen={isChangePasswordModalOpen}
          onClose={() => setIsChangePasswordModalOpen(false)}
          email={session.email}
        />
      )}
    </main>
  );
}