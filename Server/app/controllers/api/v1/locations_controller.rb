class Api::V1::LocationsController < ApplicationController

  def create
    @location = Location.create(lat: params[:lat], lng: params[:lng], user_id: params[:user_id])
    render json: @location
  end

  def index
    @locations = Location.all
    render json: @locations
  end

  def show
    @location = Location.find(params[:id])
    render json: @location
  end

  private

  # def location_params
  #   params.permit(:lat, :lng, :user_id)
  # end

  # def find_location
  # end
end
