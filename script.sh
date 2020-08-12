#!/bin/sh -l

GITHUB_USERNAME="$1"
GITHUB_REPO="$1"
USER_EMAIL="$2"
README_FILE="$3"

echo "Starting the job"

# CLONE_DIR=$(mktemp -p . -d)

#Setup git
git config --global user.email "$USER_EMAIL"
git config --global user.name "$GITHUB_USERNAME"
git config --global user.password "$API_TOKEN_GITHUB"

# git clone "https://$3@github.com/$GITHUB_USERNAME/$GITHUB_REPO.git" "$CLONE_DIR"

cd "$CLONE_DIR"

git add .
git commit --message "Update from"
git push origin master