# Documentation Technique - Site Pearl Nguyen

## Table des matières

1. [Vue d'ensemble](#vue-densemble)
2. [Architecture technique](#architecture-technique)
3. [Base de données](#base-de-données)
4. [API et Edge Functions](#api-et-edge-functions)
5. [Authentification](#authentification)
6. [Composants Frontend](#composants-frontend)
7. [Déploiement](#déploiement)
8. [Maintenance](#maintenance)

## Vue d'ensemble

Site web professionnel pour Pearl Nguyen, psychologue clinicienne, thérapeute et graphothérapeute. Le site présente ses services, permet la gestion d'un blog et offre un système de prise de contact.

### Fonctionnalités principales

- Présentation des services (Psychologie, Graphothérapie)
- Blog avec interface d'administration
- Formulaire de contact avec notifications par email
- Gestion des collaborations professionnelles
- Interface responsive et animations fluides

### Stack technique

- Frontend : React + TypeScript + Vite
- Styling : Tailwind CSS
- Backend : Supabase (PostgreSQL + Edge Functions)
- Email : EmailJS
- Animations : Framer Motion
- Icons : Lucide React

## Architecture technique

### Structure du projet

```
/
├── docs/                 # Documentation
├── public/              # Assets statiques
├── src/
│   ├── components/     # Composants React réutilisables
│   ├── lib/           # Utilitaires et configuration
│   └── pages/         # Pages de l'application
├── supabase/
│   ├── functions/     # Edge Functions
│   └── migrations/    # Migrations SQL
```

### Dépendances principales

```json
{
  "@emailjs/browser": "^4.3.3",
  "@supabase/supabase-js": "^2.39.7",
  "@tiptap/core": "^2.2.4",
  "@tiptap/react": "^2.2.4",
  "date-fns": "^3.3.1",
  "framer-motion": "^11.0.8",
  "fuse.js": "^7.0.0",
  "lucide-react": "^0.344.0",
  "react": "^18.3.1",
  "react-router-dom": "^6.22.3"
}
```

## Base de données

### Tables principales

#### blog_posts
- `id`: uuid (PK)
- `title`: text
- `content`: text
- `excerpt`: text
- `cover_image`: text
- `reading_time`: integer
- `created_at`: timestamptz
- `updated_at`: timestamptz
- `image_width`: integer
- `image_height`: integer

#### contact_requests
- `id`: uuid (PK)
- `name`: text
- `email`: text
- `phone`: text
- `request_type`: text
- `message`: text
- `created_at`: timestamptz
- `status`: text

#### contact_request_logs
- `id`: uuid (PK)
- `contact_request_id`: uuid (FK)
- `event_type`: text
- `status`: text
- `message`: text
- `details`: jsonb
- `created_at`: timestamptz

#### admin_users
- `id`: uuid (PK)
- `email`: text (UNIQUE)
- `password_hash`: text
- `created_at`: timestamptz
- `updated_at`: timestamptz

#### password_reset_tokens
- `id`: uuid (PK)
- `email`: text (FK -> admin_users.email)
- `token`: text
- `expires_at`: timestamptz
- `created_at`: timestamptz
- `used_at`: timestamptz

### Politiques RLS

Toutes les tables ont RLS activé avec des politiques spécifiques :

#### blog_posts
```sql
-- Lecture publique
CREATE POLICY "Allow public read access"
  ON blog_posts FOR SELECT TO public
  USING (true);

-- Écriture pour utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to insert"
  ON blog_posts FOR INSERT TO authenticated
  WITH CHECK (true);
```

#### contact_requests
```sql
-- Insertion publique
CREATE POLICY "Allow public to insert contact requests"
  ON contact_requests FOR INSERT TO public
  WITH CHECK (true);

-- Lecture pour utilisateurs authentifiés
CREATE POLICY "Allow authenticated users to read contact requests"
  ON contact_requests FOR SELECT TO authenticated
  USING (true);
```

## API et Edge Functions

### Contact Notification

**Endpoint**: `/functions/v1/contact-notification`

**Description**: Envoie une notification par email lors d'une nouvelle demande de contact.

**Configuration**:
```typescript
const emailConfig = {
  from: 'Pearl Nguyen <contact@pearl-nguyen.eu>',
  to: ['pearl@nguyen.eu']
};
```

**Trigger PostgreSQL**:
```sql
CREATE FUNCTION handle_new_contact_request()
RETURNS trigger AS $$
BEGIN
  -- Envoi de la notification
  PERFORM net.http_post(
    url := current_setting('app.settings.supabase_url') || '/functions/v1/contact-notification',
    headers := jsonb_build_object(
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key'),
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object('record', row_to_json(NEW))
  );
  
  -- Mise à jour du statut
  UPDATE contact_requests
  SET status = 'sent'
  WHERE id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Système d'emails

Le site utilise EmailJS pour :
- Emails de contact
- Réinitialisation de mot de passe
- Notifications administratives

### Stockage des images

**Bucket**: `blog-images`

**Politiques**:
```sql
CREATE POLICY "Allow public storage access"
  ON storage.objects FOR ALL TO public
  USING (bucket_id = 'blog-images')
  WITH CHECK (bucket_id = 'blog-images');
```

## Authentification

### Système d'authentification personnalisé

- Table `admin_users` pour la gestion des administrateurs
- Système de réinitialisation de mot de passe avec tokens
- Hachage des mots de passe avec pgcrypto

### Utilisateurs autorisés
- `pearl@nguyen.eu`
- `joelle@nguyen.eu`

### Sécurité
```typescript
// Vérification dans PrivateRoute
if (!session || !AUTHORIZED_EMAILS.includes(session.email)) {
  return <Navigate to="/login" replace />;
}
```

## Composants Frontend

### TipTapEditor
Éditeur WYSIWYG pour le blog avec :
- Formatage de texte
- Liens
- Listes
- Citations
- Alignement
- Historique

### ContactForm
Formulaire de contact avec :
- Validation des champs
- Types de demandes prédéfinis
- Feedback utilisateur
- Gestion des erreurs

### SearchDialog
Recherche globale avec :
- Recherche instantanée
- Historique des recherches
- Suggestions contextuelles
- Navigation rapide

### DomainModal
Modal pour afficher les domaines d'intervention avec :
- Animations fluides
- Images optimisées
- Descriptions détaillées

### WritingQuill
Animation personnalisée pour la section graphothérapie avec :
- Animations SVG
- Effets de particules
- Transitions fluides

## Déploiement

### Prérequis
1. Compte Supabase
2. Compte EmailJS
3. Compte Netlify

### Variables d'environnement
```env
VITE_SUPABASE_URL=https://gwiyyjttieopbdcfnlga.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGci...
```

### Commandes
```bash
# Build
npm run build

# Preview
npm run preview
```

## Maintenance

### Logs
Les logs sont stockés dans la table `contact_request_logs` avec :
- Type d'événement
- Statut
- Message
- Détails (JSON)
- Horodatage

### Monitoring
Vérifier régulièrement :
1. Les logs de contact
2. Les erreurs d'envoi d'email
3. L'espace de stockage des images
4. Les performances de la base de données

### Sauvegardes
Supabase effectue des sauvegardes automatiques quotidiennes.

### Mises à jour
1. Dépendances npm : `npm update`
2. Migrations Supabase : via l'interface CLI
3. Edge Functions : déploiement automatique

### Problèmes connus
1. Chargement intermittent de l'image TCC :
   - Solution temporaire : Ajout d'un timestamp à l'URL
   - Gestion des erreurs avec fallback
2. Lecture automatique de la vidéo :
   - Problème de chargement initial
   - À investiguer ultérieurement