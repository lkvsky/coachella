class UsersController < ApplicationController
  def index
    users = { :users => User.all }.map { |user| user.formatted_json }

    respond_to do |format|
      format.json { render :json => users }
    end
  end

  def show
    user = User.find(params[:id])

    respond_to do |format|
      format.json { render :json => user.formatted_json }
    end
  end

  def current
    if !current_user.nil?
      user = { :current_user => current_user.formatted_json }
    else
      user = { :current_user => current_user }
    end

    respond_to do |format|
      format.json { render :json => user }
    end
  end
end
