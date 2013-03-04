class RegistrationsController < Devise::RegistrationsController
  def create
    build_resource
 
    if resource.save
      if resource.active_for_authentication?
        guest_user.transfer_associations(resource)

        set_flash_message :notice, :signed_up if is_navigational_format?
        sign_up(resource_name, resource)
        return render :json => {:success => true}
      else
        set_flash_message :notice, :"signed_up_but_#{resource.inactive_message}" if is_navigational_format?
        expire_session_data_after_sign_in!
        return render :json => {:success => true}
      end
    else
      clean_up_passwords resource

      respond_to do |format|
        format.json { render :json => resource.errors.full_messages.join(","), :status => 401 }
      end
    end
  end
 
  # Signs in a user on sign up. You can overwrite this method in your own
  # RegistrationsController.
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
