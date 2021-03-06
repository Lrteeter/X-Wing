Rails.application.routes.draw do
  root "static_pages#root"

  resources :users, only: [:new, :create]
  resource :session, only: [:new, :create, :destroy]

  namespace :api, defaults: {format: :json} do
    resources :users, only: [:new, :create, :show, :index]
    resource :sessions, only: [:show]
    resources :games
  end
end
