defmodule TaskTracker.Tasks.Task do
  use Ecto.Schema
  import Ecto.Changeset

  schema "tasks" do
    field :complete, :boolean, default: false
    field :description, :string
    field :hours, :float, default: 0.0
    field :title, :string
    belongs_to :user, TaskTracker.Users.User

    timestamps()
  end

  @doc false
  def changeset(task, attrs) do
    task
    |> cast(attrs, [:complete, :description, :hours, :title, :user_id])
    |> validate_required([:complete, :description, :hours, :title])
  end
end
