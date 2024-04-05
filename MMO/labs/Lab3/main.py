import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

#Task1
dataset = pd.read_csv("heart.csv")  

#Task2
print(dataset.isnull().any())

#Task3
y = dataset["target"].astype("string")  #Вектор меток
X = dataset.drop("target", axis=1)      #Матрица признаков

print(y.head())
print(X.head())

#Task4 разделение на обучающую и тестовую выборки
from sklearn.model_selection import cross_val_score, train_test_split

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.3, random_state=17)

print("Размер матрицы признаков для (обучающего/тестового) набора данных:", X_train.shape, X_test.shape)
print("Размер вектора меток для (обучающего/тестового) набора данных):", y_train.shape, y_test.shape)

#Task5
from sklearn.tree import DecisionTreeClassifier
from sklearn.neighbors import KNeighborsClassifier

tree = DecisionTreeClassifier(random_state=0)
tree.fit(X_train, y_train)

print("Правильность на обучающем наборе (дерево решений): {:.3f}".format(tree.score(X_train, y_train)))

knn = KNeighborsClassifier(n_neighbors=8)
knn.fit(X_train, y_train)

print("Правильность на обучающем наборе (k-ближайших): {:.3f}".format(knn.score(X_train, y_train)))

#Task6 Подбор наилучших параметров
from sklearn.model_selection import GridSearchCV

param_grid_tree = {'max_depth': range(1, 10)}
grid_search_tree = GridSearchCV(DecisionTreeClassifier(random_state=0), param_grid_tree, cv=5)
grid_search_tree.fit(X_train, y_train)

print("Наилучшие параметры дерева решений: {}".format(grid_search_tree.best_params_))
print("Наилучшая оценка дерева решений: {:.3f}".format(grid_search_tree.best_score_))

param_grid_knn = {'n_neighbors': range(1, 10)}
grid_search_knn = GridSearchCV(KNeighborsClassifier(), param_grid_knn, cv=5)
grid_search_knn.fit(X_train, y_train)

print("Наилучшие параметры k-ближайших соседей: {}".format(grid_search_knn.best_params_))
print("Наилучшая оценка k-ближайших соседей: {:.3f}".format(grid_search_knn.best_score_))

#Task7
from sklearn.metrics import confusion_matrix

tree_pred = tree.predict(X_test)
tree_cm = confusion_matrix(y_test, tree_pred)
print("Матрица ошибок для дерева решений:\n", tree_cm)

knn_pred = knn.predict(X_test)
knn_cm = confusion_matrix(y_test, knn_pred)
print("Матрица ошибок для k-ближайших соседей:\n", knn_cm)

#Task8
best_model = grid_search_tree if grid_search_tree.best_score_ > grid_search_knn.best_score_ else grid_search_knn
print("Лучшая модель: ", type(best_model.best_estimator_).__name__)