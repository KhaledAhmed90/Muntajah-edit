-- Create storage bucket for product images
CREATE BUCKET IF NOT EXISTS product_images;

-- Enable public access for the bucket
UPDATE storage.buckets 
SET public = true 
WHERE id = 'product_images';

-- Create storage policy to allow authenticated uploads
CREATE POLICY "Allow authenticated uploads" 
ON storage.objects 
FOR INSERT 
TO authenticated 
WITH CHECK (
  bucket_id = 'product_images' AND 
  (auth.role() = 'authenticated')
);

-- Create storage policy to allow public read access
CREATE POLICY "Allow public read access" 
ON storage.objects 
FOR SELECT 
TO public 
USING (bucket_id = 'product_images');