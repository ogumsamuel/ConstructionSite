GILGAL LAND CONSTRUCTION LIMITED

Building Sustainable Projects

A modern, full-stack construction and civil engineering company website built for GILGAL LAND CONSTRUCTION LIMITED.

The platform provides a professional public-facing website for the company while also including a secure administrative dashboard for managing website content, projects, team members, services, safety information, website settings, and customer quote requests.

⸻

🚀 Live Project

Production Website:
https://gilgallandconstructionlimited.com

GitHub Repository:
https://github.com/ogumsamuel/ConstructionSite

⸻

📌 About the Project

GILGAL LAND CONSTRUCTION LIMITED is a construction and civil engineering company providing services across architectural design, construction, engineering, infrastructure, renovation, project management, and real estate.

This project was developed as a production-ready company website rather than a simple static landing page.

The website is designed around two main parts:

Public Website

Visitors can:

* Learn about the company
* Explore company services
* View completed and ongoing projects
* Learn about the company’s safety practices
* Meet the team
* Contact the company
* Submit project quotation requests

Admin Dashboard

Authorized administrators can securely:

* Manage projects
* Upload project images
* Upload project videos
* Edit project information
* Remove project media
* Manage team members
* Upload and replace team photos
* Manage services
* Manage safety content
* Manage safety principles
* Manage safety stages
* Manage quote requests
* Manage website settings
* Manage administrator authorization

⸻

🛠️ Tech Stack

Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS 4

Backend

* Next.js API Routes
* Supabase
* PostgreSQL
* Supabase Authentication
* Supabase Storage

Development & Deployment

* Git
* GitHub
* Vercel
* npm

⸻

🏗️ Project Architecture

The application follows a full-stack Next.js architecture.

construction-site/
│
├── app/
│   ├── about/
│   ├── admin/
│   │   ├── login/
│   │   ├── projects/
│   │   ├── services/
│   │   ├── team/
│   │   ├── safety/
│   │   ├── quotes/
│   │   ├── settings/
│   │   └── users/
│   │
│   ├── contact/
│   ├── projects/
│   ├── quote/
│   ├── safety/
│   ├── services/
│   ├── team/
│   │
│   └── api/
│       └── admin/
│
├── components/
│   ├── home/
│   ├── layout/
│   ├── projects/
│   ├── services/
│   └── ...
│
├── lib/
│   └── supabase/
│
├── public/
│   └── images/
│
├── proxy.ts
├── next.config.ts
├── package.json
└── README.md

⸻

🌐 Public Website

The public website contains separate pages rather than using a single-page architecture.

Main Routes

Route	Purpose
/	Homepage
/about	Company information
/services	Company services
/projects	Project portfolio
/projects/[slug]	Individual project
/safety	Safety information
/team	Team members
/contact	Contact information
/quote	Request a quotation
/admin	Admin dashboard

⸻

🧰 Company Services

The platform currently supports management of the company’s core services:

1. Architectural Design
2. Interior Decor
3. Structural Design
4. Building Construction
5. Road Construction
6. Structural Engineering
7. Drainage Works
8. Project Management
9. Renovation
10. Real Estate Services

Services are stored in Supabase and can be managed from the admin dashboard.

⸻

📁 Project Management

Projects are stored dynamically in the database.

Each project can contain:

* Project title
* URL slug
* Description
* Location
* Project type
* Status
* Featured status
* Cover image
* Gallery images
* Project videos

Administrators can:

* Create projects
* Edit projects
* Upload project images
* Upload project videos
* Remove project media
* Delete projects

⸻

🎥 Direct Video Upload Architecture

One of the important technical decisions in this project was changing how project videos are uploaded.

Originally, video files were sent through a Next.js API route.

This created a problem for larger videos because the file had to pass through the Vercel Function before reaching Supabase Storage.

The final architecture uses direct-to-Supabase Storage uploads.

                   ┌──────────────┐
                   │    Admin     │
                   │ Phone/Browser│
                   └──────┬───────┘
                          │
                          │ Project details
                          ▼
                   ┌──────────────┐
                   │   Vercel /   │
                   │    Next.js   │
                   └──────────────┘
                          │
                          │ Request signed upload
                          ▼
                   ┌──────────────┐
                   │   Supabase   │
                   │   Storage    │
                   └──────▲───────┘
                          │
                          │ Direct video upload
                          │
                   ┌──────┴───────┐
                   │    Admin     │
                   │    Device    │
                   └──────────────┘

The application:

1. Authenticates the administrator.
2. Requests permission to upload a video.
3. Generates a signed Supabase Storage upload URL/token.
4. Uploads the actual video directly from the browser to Supabase.
5. Creates a project_media database record.
6. Associates the uploaded video with the project.

This avoids sending large video files through the Vercel server.

⸻

🗄️ Supabase Database

The application uses Supabase PostgreSQL for its primary application data.

Important tables include:

projects

Stores project information.

project_media

Stores project images and videos.

id
project_id
media_type
storage_path
file_name
created_at

services

Stores company services.

team_members

Stores team member information and qualifications.

safety_content

Stores general safety information.

safety_principles

Stores individual safety principles.

safety_stages

Stores safety process stages.

quote_requests

Stores quotation requests submitted by website visitors.

website_settings

Stores company-wide website configuration and social/contact information.

user_roles

Controls administrator authorization.

⸻

🔐 Authentication & Authorization

The admin dashboard uses Supabase Authentication.

Authentication alone does not determine whether a user is an administrator.

The application also checks the user_roles table.

Supabase Auth
      │
      ▼
Authenticated User
      │
      ▼
user_roles
      │
      ├── admin → Access granted
      │
      └── no admin role → Access denied

Administrative operations are protected on the server using an isAdmin() authorization check.

This prevents the frontend alone from determining administrative permissions.

⸻

🛡️ Admin Security

Administrative API routes verify the authenticated user’s administrator role before performing sensitive operations.

Protected operations include:

* Creating projects
* Editing projects
* Deleting projects
* Uploading project media
* Managing team members
* Managing services
* Managing safety content
* Managing quote requests
* Updating website settings
* Managing administrator roles

Delete operations also include confirmation on the admin interface.

⸻

🖼️ Supabase Storage

Supabase Storage is used for private application media.

Storage is separated logically by feature.

Examples:

project-media/
├── projects/
│   └── [project-id]/
│       ├── images/
│       └── videos/
team-members/
└── team member images/
quote-documents/
└── customer documents/

Private files are accessed through signed URLs where appropriate.

⸻

📋 Quote Requests

Visitors can submit project quotation requests containing information such as:

* Name
* Phone number
* Email
* Location
* Project type
* Budget
* Preferred start date
* Project description
* Optional supporting document

Administrators can view and manage submitted requests through the dashboard.

⸻

👥 Team Management

Administrators can manage team member information including:

* Name
* Role
* Description
* Years of service
* Biography
* Qualifications
* Display order
* Active status
* Profile image

Team images are stored in Supabase Storage.

Administrators can also replace an existing team member’s image when editing their profile.

⸻

⚙️ Website Settings

The website includes a central settings system for company information.

Administrators can manage:

* Company name
* Company slogan
* Company description
* Address
* Primary phone
* Secondary phone
* WhatsApp
* Email
* LinkedIn
* Instagram
* YouTube
* Website title
* SEO description
* Footer text

This allows common company information to be managed without modifying source code.

⸻

📱 Responsive Design

The website is designed to work across:

* Desktop
* Laptop
* Tablet
* Mobile phones

The admin dashboard is also designed to support mobile administration, allowing authorized administrators to manage content from a phone.

⸻

🎨 Brand Identity

The website follows the company’s visual identity using the official GILGAL LAND CONSTRUCTION LIMITED logo and its primary brand colors.

The company slogan is:

Building Sustainable Projects

⸻

🔧 Local Development

Requirements

Before running the project locally, install:

* Node.js
* npm
* Git

⸻

Clone the Repository

git clone https://github.com/ogumsamuel/ConstructionSite.git

Navigate into the project:

cd ConstructionSite

Install dependencies:

npm install

⸻

🔑 Environment Variables

Create a .env.local file in the project root.

NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
SUPABASE_SECRET_KEY=your_supabase_secret_key

Important

Never commit .env.local or expose the Supabase secret key publicly.

The secret key must only be used in secure server-side code.

⸻

▶️ Run the Development Server

npm run dev

The application will normally be available at:

http://localhost:3000

If port 3000 is already in use, Next.js may automatically select another available port.

⸻

🏗️ Production Build

To verify that the project builds successfully:

npm run build

To run the production build locally:

npm start

⸻

🚀 Deployment

The project is connected to GitHub and deployed through Vercel.

The deployment workflow is:

Local Development
       │
       ▼
Git Commit
       │
       ▼
GitHub
       │
       ▼
Vercel
       │
       ▼
Production Website

Changes pushed to the repository’s main branch trigger a Vercel deployment.

⸻

🔄 Git Workflow

A typical development workflow:

git status

Stage changes:

git add .

Commit:

git commit -m "Describe the change"

Push:

git push origin master:main

Vercel then deploys the updated application.

⸻

📌 Important Development Principles

This project follows several principles to keep the production application maintainable:

Server-side authorization

Security-sensitive operations are protected on the server rather than relying solely on frontend checks.

Database-driven content

Company content that administrators need to manage is stored in Supabase instead of being hardcoded into the frontend.

Private storage

Sensitive uploaded files are kept in private Supabase Storage buckets and accessed through controlled URLs.

Direct large-file uploads

Large project videos are uploaded directly to Supabase Storage instead of passing through Vercel Functions.

Reusable components

The application uses reusable components to reduce duplication and make future changes easier.

Responsive administration

The admin dashboard supports content management from both desktop and mobile devices.

⸻

🧪 Testing

Before pushing major changes:

npm run build

Administrative features should also be tested for:

* Authentication
* Authorization
* Create
* Edit
* Delete
* File uploads
* File replacement
* File removal
* Mobile responsiveness

⸻

📂 Important Project Files

File / Directory	Purpose
app/	Pages, routes and API routes
app/admin/	Administrative dashboard
app/api/admin/	Protected admin APIs
components/	Reusable UI components
lib/supabase/	Supabase clients and server utilities
public/images/	Public website images
proxy.ts	Admin route protection
next.config.ts	Next.js configuration
.env.local	Local environment variables

⸻

👨‍💻 Developer

Ogum Samuel Boniface

Software Developer / IT Consultant

GitHub

https://github.com/ogumsamuel

LinkedIn

https://www.linkedin.com/in/ogumsamuel

⸻

🏢 Client

GILGAL LAND CONSTRUCTION LIMITED

Building Sustainable Projects

Construction • Civil Engineering • Project Management • Real Estate

⸻

📄 License

This project was developed for GILGAL LAND CONSTRUCTION LIMITED.

The source code is maintained by the developer for the company’s website and related systems.

Unauthorized reuse, redistribution, or commercial modification of the project should be agreed upon with the project owner/developer.

⸻

⭐ Project Status

Production-ready construction company website with integrated administrative content management.

Core functionality includes:

* ✅ Responsive public website
* ✅ Supabase database
* ✅ Supabase authentication
* ✅ Role-based admin authorization
* ✅ Project management
* ✅ Project image management
* ✅ Direct project video uploads
* ✅ Team management
* ✅ Service management
* ✅ Safety content management
* ✅ Quote request management
* ✅ Website settings management
* ✅ Secure file storage
* ✅ Mobile admin support
* ✅ GitHub version control
* ✅ Vercel deployment