import numpy as np
import pandas as pd

def part_NumPy():
    print("Часть про NumPy:\n")
    arr = np.random.randint(0, 100, 20).reshape(4, 5)
    print(f"Исходный массив:\n{arr}\n")

    arr1, arr2 = np.split(arr, 2)
    print(f"Первый массив:\n{arr1}\n")
    print(f"Второй массив:\n{arr2}\n")

    values = arr1[arr1 == 6]
    print(f"Значения, равные 6, в первом массиве: {values}")

    count = len(values)
    print(f"Количество найденных элементов: {count}")
    print("----------------------------------------------")

def part_Pandas():
    print("Часть про Pandas:\n")

    s = pd.Series(np.random.randint(0, 100, 10))
    print(f"Объект Series:\n{s}\n")

    print(f"Сумма элементов: {s.sum()}")
    print(f"Среднее значение: {s.mean()}\n")

    df = pd.DataFrame(np.random.randint(0, 100, 20).reshape(4, 5), list('ABCD'), list('ABCDE'))
    print(f"Объект Dataframe:\n{df}\n")

    df = df.drop('A')
    print(f"Dataframe после удаления строки:\n{df}\n")

    # axis=1 => операции для столбцов, axis=0 => операции для строк
    df = df.drop('A', axis=1)
    print(f"Dataframe после удаления столбца:\n{df}\n")

    print(f"Размер Dataframe: {df.shape}\n")

    num = 50
    elements = df[df == num].dropna(how='all').dropna(axis=1, how='all')
    print(f"Элементы, равные {num}:\n{elements}")


if __name__ == '__main__':
    part_NumPy()
    part_Pandas()

