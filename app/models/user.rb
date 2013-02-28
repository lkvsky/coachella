class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me
  attr_accessible :username

  has_many :playlists
  has_many :song_likes
  has_many :song_dislikes

  has_many :favorite_songs, :through => :song_dislikes, :source => :song
  has_many :disliked_songs, :through => :song_likes, :source => :song
end