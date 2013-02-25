Coachella::Application.routes.draw do
  resources :playlists
  resources :bands, :only => [:index, :show]
  resources :songs do
    resources :song_likes, :only => [:create, :destroy], :as => :likes
    resources :song_dislikes, :only => [:create, :destroy], :as => :dislikes
  end
end
