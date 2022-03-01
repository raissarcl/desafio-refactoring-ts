import { useEffect, useState } from 'react';

import Header from '../../components/Header';
import api from '../../services/api';
import Foods from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';

interface Food {
  id: number;
  name: string;
  description: string;
  price: number;
  available: boolean;
  image: string;
}

function Dashboard() {
  const [foods, setFoods] = useState<Food[]>([]);
  const [editingFood, setEditingFood] = useState<Food>({} as Food);
  const [isModalOpen, setModalOpen] = useState(false);
  const [isEditModalOpen, setEditModalOpen] = useState(false);


  useEffect(() => {
    api.get('foods').then(res => setFoods(res.data));
  }, []);

  async function handleAddFood(food: Food) {
    try {
      const response = await api.post('foods', {
        ...food,
        available: true
      });

      setFoods([...foods, response.data]);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food: Food) {
    try {
      const foodUpdated: Food = await api.put(`foods/${editingFood.id}`, 
      { ...editingFood, ...food}).then(res => res.data);

      const foodsUpdated: Food[] = foods.map(food => {
        return food.id !== foodUpdated.id ? food : foodUpdated
      });

      setFoods([...foodsUpdated]);

      } catch (err) {
      console.log(err);

    }
  }

  async function handleDeleteFood(id: number) {
    await api.delete(`foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setFoods(foodsFiltered);
  }

  function toggleModal() {
    setModalOpen(!isModalOpen);
  }

  function toggleEditModal() {
    setEditModalOpen(!isEditModalOpen);
  }

  function handleEditFood(food: Food) {
    setEditingFood(food);
    setEditModalOpen(true);
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={isModalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={isEditModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Foods
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
            />
          ))}
      </FoodsContainer>
    </>
  );
}

export default Dashboard;
