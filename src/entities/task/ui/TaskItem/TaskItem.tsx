import { Button, Tag } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import styles from "./TaskItem.module.css";
import { type Task } from "../types/types";

/**
 * @interface TaskItemProps
 * @property {(id: number) => void} onDelete колбэк-функция, вызываемая при запросе на удаление задачи
 * @property {(id: number) => void} onEdit колбэк-функция, вызываемая при клике на элемент задачи для редактирования
 */
interface TaskItemProps {
  item: Task;
  onDelete: (id: number) => void;
  onEdit: (id: number) => void;
}

/**
 * @function getCategoryColor
 * @description определяет цвет тега категории на основе значения категории задачи
 * @param {Task['category']} category категория задачи
 */
const getCategoryColor = (category: Task["category"]) => {
  switch (category) {
    case "Bug":
      return "red";
    case "Feature":
      return "blue";
    case "Documentation":
      return "geekblue";
    case "Refactor":
      return "purple";
    case "Test":
      return "green";
    default:
      return "default";
  }
};

/**
 * @function getPriorityColor
 * @description определяет цвет тега приоритета на основе значения приоритета задачи
 * @param {Task['priority']} priority приоритет задачи
 */
const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "High":
      return "red";
    case "Medium":
      return "orange";
    case "Low":
      return "green";
    default:
      return "default";
  }
};

/**
 * @function TaskItem
 * @description компонент для отображения одной задачи в списке
 * @param {TaskItemProps} props
 */
export default function TaskItem({ item, onDelete, onEdit }: TaskItemProps) {
  const formattedDateTime = new Date(item.createdAt).toLocaleString([], {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div
      className={`${styles.card__container} ${item.status === "Done" ? styles.card__done : ""}`}
      onClick={() => onEdit(item.id)}
    >
      <div className={styles.card__inner}>
        <div>
          <h4
            className={`${styles.card__title} ${item.status === "Done" ? styles.card__done : ""}`}
          >
            {item.title}
          </h4>
          <p className={styles.card__description}>{item.description}</p>
          <div className={styles.card__tags}>
            <Tag color={getCategoryColor(item.category)}>{item.category}</Tag>
            <Tag color={getPriorityColor(item.priority)}>{item.priority}</Tag>
            <Tag>{formattedDateTime}</Tag>
          </div>
        </div>
      </div>
      <div className={styles.card__actions}>
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
          }}
        />
      </div>
    </div>
  );
}
