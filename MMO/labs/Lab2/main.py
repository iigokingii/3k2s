import pandas as pd
import numpy as np
import seaborn as sns
import matplotlib.pyplot as plt
import matplotlib.mlab as mlab

dataset=pd.read_csv("autoscout24-germany-dataset.csv")

plt.figure(figsize=(13, 6))
plt.hist(dataset["fuel"])
plt.xlabel("Вид топлива")
plt.ylabel("Частота")
plt.title("Гистограмма распределения топлива (перед обработкой пропущенных значений)")
plt.show()

print(dataset.isnull().any())

null_counts = dataset.isnull().sum()
for column, count in null_counts.items():
    print(f"{column}: {count} пропусков")

total_values = dataset.shape[0]
null_percentages = (null_counts / total_values) * 100
for column, percentage in null_percentages.items():
    print(f"{column}: {percentage:.2f}% пропущенных значений")

# Тепловая карта
plt.figure(figsize=(13, 6))
sns.heatmap(dataset[dataset.columns[:]].isnull(), cmap=sns.color_palette(['#eeeeee', '#ff0000']))
plt.show()

#Исключение строк и столбцов с наибольшим количеством пропусков
columns_to_drop = ["model", "gear"]
dataset = dataset.dropna(subset=columns_to_drop, axis=0)
dataset = dataset.drop(columns_to_drop, axis=1)

# Замена оставшихся пропусков средними значениями
dataset["hp"] = dataset["hp"].fillna(dataset["hp"].mean())

print(dataset.isnull().any())

plt.figure(figsize=(13, 6))
plt.hist(dataset["fuel"])
plt.xlabel("Вид топлива")
plt.ylabel("Частота")
plt.title("Гистограмма распределения топлива (после обработкой пропущенных значений)")
plt.show()

# До изменения (10.1 MB)
print(dataset.dtypes)
print(dataset.info(memory_usage='deep'))

mileage_top = dataset["mileage"].nlargest(100000)
print(mileage_top)
mean_value = dataset["mileage"].mean()

print(f"Среднее значение столбца mileage: {mean_value}")

prices_top = dataset["price"].nlargest(100000)
print(prices_top)
mean_value = dataset["price"].mean()

print(f"Среднее значение столбца price: {mean_value}")

columns_to_check = ['mileage', 'price']

# Функция для удаления аномальных записей на основе IQR
def remove_outliers_iqr(data, column):
    Q1 = np.percentile(data[column], 25)
    Q3 = np.percentile(data[column], 75)
    IQR = Q3 - Q1
    threshold = 1.5 * IQR
    data = data[(data[column] >= Q1 - threshold) & (data[column] <= Q3 + threshold)]
    return data

# удаление выбросов
for column in columns_to_check:
    dataset = remove_outliers_iqr(dataset, column)


mileage_top = dataset["mileage"].nlargest(100000)
print(mileage_top)
mean_value = dataset["mileage"].mean()

print(f"Среднее значение столбца mileage: {mean_value}")

prices_top = dataset["price"].nlargest(100000)
print(prices_top)
mean_value = dataset["price"].mean()

print(f"Среднее значение столбца price: {mean_value}")



# Поля то int
fields_to_convert = ['make', 'fuel', 'offerType']
# Цикл для замены типа данных для каждого поля
for field in fields_to_convert:
    if field in dataset.columns and dataset[field].dtype == object:
        dataset[field] = pd.to_numeric(dataset[field].str.rstrip('%'), errors='coerce')

# После изменения (3.6 MB)
print(dataset.dtypes)
print(dataset.info(memory_usage='deep'))

dataset.to_csv('processed_dataset.csv', index=False)

