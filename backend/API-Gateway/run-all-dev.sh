cd ..

for dir in */ ; do
  if [ -f "$dir/package.json" ]; then
    echo "Opening terminal for $dir"
    osascript <<EOF
tell application "Terminal"
    do script "cd \"$(pwd)/$dir\" && npm run dev"
    activate
end tell
EOF
  else
    echo "Skipping $dir - no package.json"
  fi
done
