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

  validates :username, :presence => true

  has_many :playlists
  has_many :song_likes
  has_many :song_dislikes

  has_many :favorite_songs, :through => :song_likes, :source => :song
  has_many :disliked_songs, :through => :song_dislikes, :source => :song

  def self.find_for_facebook_oauth(auth, guest_user=nil)
    user = User.where(:provider => auth.provider, :uid => auth.uid).first

    unless user
      if User.existing_user?(auth.info.email)
        user = User.find_by_email(auth.info.email)
        user.merge_existing_user_account(auth)
        user
      else
        user = User.create_facebook_user(auth)
        
        unless guest_user.nil?
          guest_user.transfer_associations(user)
        end

        user
      end
    end

    user
  end

  def self.create_facebook_user(auth)
    user = User.create(
      :username => auth.info.name,
      :provider => auth.provider,
      :uid => auth.uid,
      :email => auth.info.email,
      :access_token => auth.credentials.token,
      :password => Devise.friendly_token[0,20]
    )
  end

  def self.existing_user?(email)
    true if User.find_by_email(email)
  end

  def signed_up_with_fb?
    true if User.find_by_email(self.email).provider == "facebook"
  end

  def transfer_associations(new_user)
    self.playlists.each { |playlist| playlist.update_attributes(:user_id => new_user.id) }
    self.song_likes.each { |song_like| song_like.update_attributes(:user_id => new_user.id) }
    self.song_dislikes.each { |song_dislike| song_dislike.update_attributes(:user_id => new_user.id) }
  end

  def merge_existing_user_account(auth)
    self.update_attributes(:provider => auth.provider,
                           :uid => auth.uid,
                           :access_token => auth.credentials.access_token)
  end
end