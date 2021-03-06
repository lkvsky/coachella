class RegistrationsController < Devise::RegistrationsController
  def create
    build_resource
 
    if resource.save
      if resource.active_for_authentication?
        guest_user.transfer_associations(resource)
        sign_up(resource_name, resource)

        return render :json => { :success => true }
      else
        expire_session_data_after_sign_in!
        
        return render :json => { :success => true }
      end
    else
      clean_up_passwords resource

      respond_to do |format|
        format.json { render :json => resource.errors.full_messages.join(", "), :status => 401 }
      end
    end
  end

  def sign_up(resource_name, resource)
    sign_in(resource_name, resource)
  end

  private

  def guest_user
    User.find(session[:guest_user_id] ||= create_guest_user.id)

    rescue ActiveRecord::RecordNotFound
      session[:guest_user_id] = nil
      guest_user
  end
 
end
