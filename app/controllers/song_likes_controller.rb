class SongLikesController < ApplicationController
  def create
    user = current_or_guest_user
    song = Song.find(params[:like])

    like = SongLike.new(:song_id => song.id, :user_id => user.id)

    if like.save
      if song.disliked?(user)
        user.song_dislikes.where(:song_id => song.id).first.destroy
      end

      song_status = { :like => "true", :dislike => "false" }

      respond_to do |format|
        format.json { render :json => song_status }
      end
    else
      destroy
    end
  end

  def index
    user = current_or_guest_user
    songs = user.favorite_songs.map { |song| song.formatted_json(user) }

    respond_to do |format|
      format.json { render :json => songs }
    end
  end

  def destroy
    user = current_or_guest_user

    if params[:like]
      song = Song.find(params[:like])
    elsif params[:id]
      song = Song.find(params[:id])
    end
    
    like = User.find(user.id).song_likes.where(:song_id => song.id).first
    like.destroy

    song_status = { :like => "false", :dislike => "#{song.disliked?(user)}" }

    respond_to do |format|
      format.json { render :json => song_status, :status => 200 }
    end
  end
end
