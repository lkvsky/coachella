class SongLikesController < ApplicationController
  def create
    songId = params[:like]

    like = SongLike.new(:song_id => songId, :user_id => current_user.id)
    like.save!

    respond_to do |format|
      format.json { render :json => like }
    end
  end

  def destroy
    songId = params[:like]
    
    like = User.find(current_user.id).song_likes.where(:song_id => songId).first
    like.destroy

    respond_to do |format|
      format.json { render :json => like }
    end
  end
end
