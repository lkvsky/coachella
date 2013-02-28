class SongLikesController < ApplicationController
  def create
    song = Song.find(params[:like])

    like = SongLike.new(:song_id => song.id, :user_id => current_user.id)

    if like.save
      if song.disliked?(current_user)
        current_user.song_dislikes.where(:song_id => song.id).first.destroy
      end

      song_status = { :like => true, :dislike => false }

      respond_to do |format|
        format.json { render :json => song_status }
      end
    else
      destroy
    end
  end

  def index
    songs = current_user.favorite_songs.map { |song| song.formatted_json(current_user) }

    respond_to do |format|
      format.json { render :json => songs }
    end
  end

  def destroy
    if params[:like]
      song = Song.find(params[:like])
    elsif params[:id]
      song = Song.find(params[:id])
    end
    
    like = User.find(current_user.id).song_likes.where(:song_id => song.id).first
    like.destroy

    song_status = { :like => false, :dislike => song.disliked?(current_user) }

    respond_to do |format|
      format.json { render :json => song_status }
    end
  end
end
