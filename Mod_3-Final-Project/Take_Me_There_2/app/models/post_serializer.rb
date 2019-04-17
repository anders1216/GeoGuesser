class PostSerializer < ActiveModel::Serializer
  has_many :users, :locations
  attributes :username, :lngGuess, :latGuess, :lng, :lat, :user_id
end
