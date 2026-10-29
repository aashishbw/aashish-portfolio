# Aashish Upadhyaya — Animated Portfolio

A standalone, responsive HTML/CSS/JavaScript portfolio based on the supplied CV.

## Preview
Open `index.html` in a browser. Internet access is needed for Google Fonts and for tawk.to once configured.

## Publish free with GitHub + Vercel
1. Create a new GitHub repository (for example, `aashish-animated-portfolio`).
2. Upload `index.html`, `styles.css`, `script.js`, and the `assets` folder to the repository root.
3. In Vercel, choose **Add New → Project**, import the repository, select **Other** framework, and deploy. No build command is needed.

## Enable tawk.to live chat
1. Sign in at https://www.tawk.to/ and create/select your website property.
2. In tawk.to, open **Administration → Channels → Chat Widget** and find the widget's embed code.
3. In `script.js`, replace `YOUR_PROPERTY_ID` and `YOUR_WIDGET_ID` with the two segments in the embed URL (`https://embed.tawk.to/PROPERTY_ID/WIDGET_ID`).
4. Commit the change. Vercel will redeploy. The chat widget should then appear automatically.

## Update CV
Replace `assets/Aashish_Upadhyaya_CV.pdf` with a newer version using the same filename.

## Notes
- This site does not publish birth date, marital status, or full street address.
- Experience durations reflect the supplied CV and may overlap. No chronological dates are inferred.
- The chat integration remains inactive until you add your actual tawk.to IDs.

## Profile photos
- `assets/hero-profile.jpg`: homepage laptop portrait.
- `assets/about-profile.jpg`: About section formal suit portrait.
- `assets/formal-profile.jpg`: Contact section headshot.
These are the three photos selected from the uploaded set.
