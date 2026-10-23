# Birthday Surprise 💌 (5-page version: welcome, letter, photos, memories, final)

## Structure
```
birthday-surprise/
├── index.html
├── style.css
├── script.js
├── images/  photo-1.jpg ... photo-6.jpg
└── audio/   birthday-song.mp3
```

## Run in VS Code
1. Extract the ZIP. In VS Code: File > Open Folder > birthday-surprise.
2. Extensions > install "Live Server" (Ritwick Dey).
3. Right-click index.html > Open with Live Server. (Double-clicking index.html also works.)

## Replace the 6 photos
Save six photos as photo-1.jpg ... photo-6.jpg inside images/ (same names, overwrite). Landscape photos work best; they are always cropped to 4:3, never stretched. Missing photos show a pink placeholder with the file name. For PNG files, edit the src in index.html.

## Replace the music
Put a royalty-free song at audio/birthday-song.mp3 (try pixabay.com/music). It starts when she clicks "One Last Surprise" or the music button, and keeps playing across pages. If the file is missing, a built-in Happy Birthday melody plays instead.

## Edit text
Letter: index.html, inside <div class="text">. Photo captions: the <figcaption> tags.

## Publish free
Netlify: app.netlify.com/drop, drag the whole folder in, share the link.
GitHub Pages: new repo > upload all files > Settings > Pages > Deploy from branch > main > Save.

## Photo framing tip
All photos are cropped to 4:3 (never stretched). If a face is cut off, shift that photo only, e.g. in index.html:
`<img src="images/photo-2.jpg" alt="Memory 2" style="--pos:center 80%">`
(values: `center top`, `center 80%`, `20% center`, etc.)
