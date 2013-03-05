class UsersController < ApplicationController
  def index
    users = { :users => User.all, :current_user => current_user }

    respond_to do |format|
      format.json { render :json => users }
    end
  end

  def show
    user = User.find(params[:id])

    respond_to do |format|
      format.json { render :json => user }
    end
  end

  private

  def user_logged_in?
    true unless session[:guest_user_id]
  end
end
