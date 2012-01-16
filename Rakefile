desc 'compile .coffee into .js'
task :build do
  puts "Building..."
  %x[coffee -o lib/ -c src/]
  %x[coffee -o test/lib/ -c test/src/]
end
