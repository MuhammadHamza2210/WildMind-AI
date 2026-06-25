# Docker recipe to run WildMind AI on Hugging Face Spaces (free, no card).
# It builds the React frontend, then runs the Express server (which serves the
# built frontend AND proxies AI requests) on Hugging Face's port 7860.
# Node 24 to match the local dev environment.
FROM node:24-slim

# Built-in non-root "node" user (UID 1000) as Hugging Face requires.
USER node
ENV HOME=/home/node
WORKDIR /home/node/app

# Install all dependencies (dev deps included — Vite is needed to build)
COPY --chown=node:node package*.json ./
RUN npm install

# Copy the source and build the frontend into /dist
COPY --chown=node:node . .
RUN npm run build

# Hugging Face Spaces expects the app on port 7860
ENV PORT=7860
EXPOSE 7860

CMD ["npm", "start"]
