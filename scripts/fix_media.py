import re

with open('components/admin/MediaLibrary.tsx', 'r') as f:
    content = f.read()

content = re.sub(r"const supabase = createClient\(\);", "", content)
content = re.sub(r"const \{ data, error \} = await supabase\.storage\.from\('blog-images'\)\.list\(\);\n\s*if \(data\) \{\n\s*let files = data\n\s*\.filter\(\(f: any\) => f\.name !== '\.emptyFolderPlaceholder' && f\.metadata\)\n\s*\.map\(\(f: any\) => \{\n\s*const \{ data: \{ publicUrl \} \} = supabase\.storage\.from\('blog-images'\)\.getPublicUrl\(f\.name\);\n\s*return \{\n\s*id: f\.id,\n\s*file_url: publicUrl,\n\s*file_name: f\.name,\n\s*created_at: f\.created_at\n\s*\};\n\s*\}\);\n\n\s*files\.sort\(\(a, b\) => new Date\(b\.created_at\)\.getTime\(\) - new Date\(a\.created_at\)\.getTime\(\)\);\n\n\s*if \(search\) \{\n\s*files = files\.filter\(f => f\.file_name\.toLowerCase\(\)\.includes\(search\.toLowerCase\(\)\)\);\n\s*\}\n\s*setMedia\(files\);\n\s*\}", """
      let files = await getMediaFilesClient();
      if (search) {
        files = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));
      }
      setMedia(files.map((f: any) => ({
        id: f.name,
        file_url: f.url,
        file_name: f.name,
        created_at: f.created_at || new Date().toISOString()
      })));
""", content)

with open('components/admin/MediaLibrary.tsx', 'w') as f:
    f.write(content)
