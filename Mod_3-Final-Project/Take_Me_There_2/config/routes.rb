Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  namespace :api do
    namespace :v1 do
      resources :users
    end
  end
  namespace :api do
    namespace :v1 do
      resources :locations
    end
  end
end
