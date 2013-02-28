class SongDislikesController < ApplicationController
  def create
    songId = params[:dislike]

    dislike = SongDislike.new(:song_id => songId, :user_id => current_user.id)
    dislike.save!

    respond_to do |format|
      format.json { render :json => dislike }
    end
  end

  def destroy
    songId = params[:dislike]
    
    dislike = User.find(current_user.id).song_dislikes.where(:song_id => songId).first
    dislike.destroy

    respond_to do |format|
      format.json { render :json => dislike }
    end
  end
end
