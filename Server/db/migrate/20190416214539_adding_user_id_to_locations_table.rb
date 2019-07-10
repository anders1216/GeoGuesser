class AddingUserIdToLocationsTable < ActiveRecord::Migration[5.2]
  def change
    add_column :locations, :user_id, :integer
  end
end
