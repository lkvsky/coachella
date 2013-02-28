class SongDislikesController < ApplicationController
  def create
    song = Song.find(params[:dislike])

    dislike = SongDislike.new(:song_id => song.id, :user_id => current_user.id)

    if dislike.save
      if song.liked?(current_user)
        current_user.song_likes.where(:song_id => song.id).first.destroy
      end

      song_status = { :like => false, :dislike => true }

      respond_to do |format|
        format.json { render :json => song_status }
      end
    else
      destroy
    end
  end

  def index
    songs = current_user.disliked_songs.map { |song| song.formatted_json(current_user) }

    respond_to do |format|
      format.json { render :json => songs }
    end
  end

  def destroy
    if params[:dislike]
      song = Song.find(params[:dislike])
    elsif params[:id]
      song = Song.find(params[:id])
    end
    
    dislike = User.find(current_user.id).song_dislikes.where(:song_id => song.id).first
    dislike.destroy

    song_status = { :like => song.liked?(current_user), :dislike => false }

    respond_to do |format|
      format.json { render :json => song_status }
    end
  end
end
