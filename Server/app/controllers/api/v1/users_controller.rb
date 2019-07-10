class Api::V1::UsersController < ApplicationController

  def create
    byebug
    if User.find_by(username: user_params[:username])
      render json: {errors: "Username already taken"}, status: :unprocessible_entity
    else
      @user = User.create(user_params)
      render json: @user
    end
  end

  def update
    @user = User.find(params[:id])
    @user.update(user_params)

  end

  def index
    @users = User.all
    render json: @users
  end

  def show
    @user = User.find(params[:id])
    render json: @user
  end

  private

  def user_params
      params.permit(:username, :lngGuess, :latGuess)
  end


end
