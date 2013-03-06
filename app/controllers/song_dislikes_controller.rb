class SongDislikesController < ApplicationController
  def create
    user = current_or_guest_user
    song = Song.find(params[:dislike])

    dislike = SongDislike.new(:song_id => song.id, :user_id => user.id)

    if dislike.save
      if song.liked?(current_user)
        user.song_likes.where(:song_id => song.id).first.destroy
      end

      song_status = { :like => "false", :dislike => "true" }

      respond_to do |format|
        format.json { render :json => song_status }
      end
    else
      destroy
    end
  end

  def index
    user = current_or_guest_user
    songs = user.disliked_songs.map { |song| song.formatted_json(user) }

    respond_to do |format|
      format.json { render :json => songs }
    end
  end

  def destroy
    user = current_or_guest_user

    if params[:dislike]
      song = Song.find(params[:dislike])
    elsif params[:id]
      song = Song.find(params[:id])
    end
    
    dislike = User.find(user.id).song_dislikes.where(:song_id => song.id).first
    dislike.destroy

    song_status = { :like => "#{song.liked?(current_user)}", :dislike => "false" }

    respond_to do |format|
      format.json { render :json => song_status, :status => 200 }
    end
  end
end
