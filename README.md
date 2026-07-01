# Holonode

Holonode is a full stack web application that lets users customize a 3D avatar with equippable items, color customization, and saved outfit configurations. Built with a Spring Boot backend and a Three.js/TypeScript frontend, deployed to AWS Elastic Beanstalk and S3.

## Live Demo

Frontend: http://holonode-frontend.s3-website.us-east-2.amazonaws.com  
Backend: http://holonode.us-east-2.elasticbeanstalk.com

## Features

- Interactive 3D avatar with real-time equipment rendering via Three.js
- Body type selector (Both, Type 1, Type 2) with persistent local storage
- Equipment slot system across all body regions with color customization
- Outfit save, load, update, and delete with named configurations
- Equipment search with real-time debounced filtering grouped by slot type
- HTML report generation for saved outfits with timestamps
- JWT authentication with BCrypt password hashing and token expiration handling
- IP-based rate limiting via Bucket4j
- Circular SVG loading progress indicator

## Tech Stack

**Frontend:** TypeScript, Three.js, Vite  
**Backend:** Java 25, Spring Boot, Spring Security, Hibernate JPA, SQLite  
**Infrastructure:** AWS Elastic Beanstalk (backend), AWS S3 (frontend)  
**Testing:** JUnit 5, Mockito

## Environment Setup

### Backend

Open the project root in IntelliJ IDEA as a Maven project. Before running, configure the following environment variables in your IntelliJ run configuration:

JWT_SECRET=your-secret-string-minimum-32-characters
JWT_EXPIRATION=86400000
ALLOWED_ORIGINS=http://localhost:5173

The SQLite database (`holonode.db`) is created automatically on first startup.

### Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env.development`:

VITE_API_URL=http://localhost:8080

Then run:
```bash
npm run dev
```

### Deploying Updates

**Backend:** Build with `./mvnw clean package -DskipTests` and upload the JAR from `target/` to Elastic Beanstalk via the AWS Console.

**Frontend:** Build with `npm run build` from the `frontend/` directory and upload the contents of `dist/` and `src/` to the S3 bucket.

# Asset Credits

## Icons
"Lucide" by Lucide Icons and Contributors
https://lucide.dev/
Licensed under ISC.

"Game-icons.net" by Game-icons.net
https://game-icons.net/
Licensed under Creative Commons Attribution (CC BY 3.0)

## Database Viewer
DBeaver Corp. DBeaver Community Software. https://dbeaver.io

## Wireframes
Excalidraw Contributors. Excalidraw Web application. https://excalidraw.com

## 3D Models

### Model Viewer And Editor
Blender Foundation. Blender Software. https://www.blender.org

### Avatars
"PLANAR HUMAN BASE RIGS" by dacancino
https://skfb.ly/6rG8x
Licensed under Creative Commons Attribution (CC BY 4.0).

### Helmets
"Elven Helmet for games" by Mads.Stenberg
https://skfb.ly/6XsNs
Licensed under Creative Commons Attribution (CC BY 4.0).

"Gladiator Helmet" by Sylvain Delandre
https://skfb.ly/pGZxF
Licensed under Creative Commons Attribution (CC BY 4.0).

### Chests
"Medieval armor" by Hene
https://skfb.ly/6WYwO
Licensed under Creative Commons Attribution (CC BY 4.0).

"Roman officer - body armour" by Andy Woodhead
https://skfb.ly/oJz88
Licensed under Creative Commons Attribution (CC BY 4.0).

### Legs
"Leather Pants (Free)" by wolfgar74
https://skfb.ly/oy6QA
Licensed under Creative Commons Attribution (CC BY 4.0).

"Medieval clothing Free" by Red_Ilya
https://skfb.ly/oDMLT
Licensed under Creative Commons Attribution (CC BY 4.0).

### Feet
"Medieval clothing Free" by Red_Ilya
https://skfb.ly/oDMLT
Licensed under Creative Commons Attribution (CC BY 4.0).

"Medieval Boots" by Peakz
https://skfb.ly/oJOxu
Licensed under Creative Commons Attribution (CC BY 4.0).
