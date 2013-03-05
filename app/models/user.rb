class User < ActiveRecord::Base
  # Include default devise modules. Others available are:
  # :token_authenticatable, :confirmable,
  # :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :omniauthable, :omniauth_providers => [:facebook]

  # Setup accessible (or protected) attributes for your model
  attr_accessible :email, :password, :password_confirmation, :remember_me,
                  :username, :provider, :uid, :access_token

  has_many :playlists
  has_many :song_likes
  has_many :song_dislikes

  has_many :favorite_songs, :through => :song_likes, :source => :song
  has_many :disliked_songs, :through => :song_dislikes, :source => :song

  def self.find_for_facebook_oauth(auth, guest_user=nil)
    user = User.where(:provider => auth.provider, :uid => auth.uid).first

    unless user
      user = User.create(
          :provider => auth.provider,
          :uid => auth.uid,
          :email => auth.info.email,
          :access_token => auth.credentials.token,
          :password => Devise.friendly_token[0,20]
        )
      
      unless guest_user.nil?
        guest_user.transfer_associations(user)
      end

      user
    end
  end

  def transfer_associations(new_user)
    self.playlists.each { |playlist| playlist.update_attributes(:user_id => new_user.id) }
    self.song_likes.each { |song_like| song_like.update_attributes(:user_id => new_user.id) }
    self.song_dislikes.each { |song_dislike| song_dislike.update_attributes(:user_id => new_user.id) }
  end
end