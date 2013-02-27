Coachella::Application.routes.draw do
  resources :playlists
  resources :songs, :only => [:index]
  resources :bands, :only => [:index, :show]
  resources :song_likes, :only => [:create, :destroy], :as => :likes
  resources :song_dislikes, :only => [:create, :destroy], :as => :dislikes

  root :to => "playlists#index"
end
