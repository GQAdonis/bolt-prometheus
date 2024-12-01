# Bolt Prometheus Project Analysis

## Current Architecture

The project is currently structured as a Remix application but needs to be converted back to a standard Vite-based application. Here's a detailed analysis of the current state and required changes:

### Current State

1. **Application Structure**
   - Currently uses Remix routing and server-side rendering
   - Has client/server entry points (`entry.client.tsx`, `entry.server.tsx`)
   - Uses Remix-specific components (`<Outlet />`, `<Links />`, `<Meta />`)
   - Chat functionality is implemented but tied to Remix routing

2. **Routing System**
   - Uses Remix file-based routing
   - Has routes:
     - `/_index.tsx`: Main landing page
     - `/chat.$model.tsx`: Dynamic chat routes
   - Current routing doesn't fully support the intended workflow for project creation and management

3. **Missing Features**
   - No project creation flow implementation
   - Missing code generation capabilities
   - No ZIP download functionality
   - No Git repository integration
   - No project template selection system
   - No build verification system

### Required Changes

1. **Framework Migration**
   - Remove Remix-specific components and dependencies
   - Replace with standard React Router for client-side routing
   - Implement Vite configuration for development server (port 5173)
   - Update entry points to use standard React 18 setup

2. **Routing Updates**
   - Implement React Router routes:
     ```
     /                     -> Project type selection
     /chat/:projectType   -> Initial project setup chat
     /chat/:projectId     -> Ongoing project refinement
     ```

3. **New Features Needed**
   - Project Type Selection:
     - React
     - SvelteKit
     - Next.js
     - Remix
   - Project Generation System:
     - Template-based scaffolding
     - Dynamic code generation
     - Build verification
   - Export Options:
     - ZIP file download
     - Git repository creation and push

4. **API Integration Requirements**
   - Git API integration for repository creation
   - Build system API for verification
   - File system operations for temporary storage
   - ZIP creation functionality

### Development Server Configuration

To align with the Dockerfile and enable debugging on port 5173:

1. **Vite Configuration**
   ```javascript
   // vite.config.ts
   export default defineConfig({
     server: {
       port: 5173,
       host: true
     },
     // ... other configurations
   })
   ```

2. **Package.json Scripts**
   ```json
   {
     "scripts": {
       "dev": "vite",
       "build": "vite build",
       "preview": "vite preview"
     }
   }
   ```

### Next Steps Priority

1. Framework Migration
   - Remove Remix dependencies
   - Setup Vite configuration
   - Implement React Router

2. Core Functionality
   - Implement project type selection
   - Create chat flow for project setup
   - Add code generation system

3. Export Features
   - Add ZIP download functionality
   - Implement Git integration

4. Build System
   - Add build verification
   - Implement project validation

## Conclusion

The current codebase requires significant restructuring to meet its intended function. While the chat interface exists, the project lacks the core functionality for project generation, build verification, and code export. The migration from Remix to a standard Vite setup will improve debugging capabilities and align with the existing Dockerfile configuration.

The project needs to maintain its current Docker compatibility while implementing these changes, ensuring that the development environment remains consistent with port 5173 for debugging purposes.
