Coachella::Application.routes.draw do
  devise_for :users, :controllers => { :registrations =>  'registrations',
                                       :omniauth_callbacks => "users/omniauth_callbacks" }

  resources :users, :only => [:index, :show] do
    collection do
      get "current"
    end
  end
  resources :playlists
  resources :songs, :only => [:index]
  resources :bands, :only => [:index, :show]
  resources :song_likes, :only => [:create, :destroy, :index], :as => :likes
  resources :song_dislikes, :only => [:create, :destroy, :index], :as => :dislikes

  root :to => "playlists#index"
end
