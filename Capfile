load 'deploy' if respond_to?(:namespace) # cap2 differentiator

default_run_options[:pty] = true

# be sure to change these
set :github_user, 'hhba'
set :github_application, "timelines"
set :user, 'timelines'
set :domain, 'timelines.hhba.info'
set :application, 'timelines'

# the rest should be good
set :repository,  "git@github.com:#{github_user}/#{github_application}.git"
set :deploy_to, "/home/#{user}/#{application}"  # or whatever path you want to copy it to
set :deploy_via, :remote_cache
set :scm, 'git'
set :branch, 'master'
set :git_shallow_clone, 1
set :scm_verbose, true
set :use_sudo, false
set :ssh_options, { :forward_agent => true }


server domain, :app, :web

# xbit is a script that runs chmod +x on all html files 
# because the site uses server side includes
namespace :deploy do
  task :xbit do
      run "cd /var/apps/#{application}/current; ../xbit"
  end
end
