import java.io.File;
import java.io.FileNotFoundException;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Lab1 {
    public static final String LATIN_ALPHABET = "abcdefghijklmnopqrstuvwxyz";
    public static final String CYRILLIC_ALPHABET = "абвгдеёжзийклмнопрстуфхцчшщъыьэюя";

    public static void main(String[] args) {
        String filePath = "D:\\3k2s\\IB\\labs\\lab1\\CIR.txt";

        try {
            String text = loadTextFromFile(filePath);
            double latinEntropy = calculateEntropy(text, LATIN_ALPHABET);
            System.out.println("Энтропия латинского алфавита: " + latinEntropy);
            double cyrillicEntropy = calculateEntropy(text, CYRILLIC_ALPHABET);
            System.out.println("Энтропия кириллического алфавита: " + cyrillicEntropy);
        } catch (FileNotFoundException e) {
            System.out.println("Файл не найден: " + e.getMessage());
        }
    }

    private static String loadTextFromFile(String filePath) throws FileNotFoundException {
        StringBuilder sb = new StringBuilder();
        File file = new File(filePath);
        try (Scanner scanner = new Scanner(file)) {
            while (scanner.hasNextLine()) {
                sb.append(scanner.nextLine());
            }
        }
        return sb.toString();
    }

    // Расчет энтропии
    private static double calculateEntropy(String text, String alphabet) {
        Map<Character, Integer> charFrequency = new HashMap<>();
        int totalCount = 0;

        // Подсчет частот символов
        for (char c : text.toCharArray()) {
            if (alphabet.indexOf(c) != -1) {
                charFrequency.put(c, charFrequency.getOrDefault(c, 0) + 1);
                totalCount++;
            }
        }

        // Расчет вероятностей и энтропии
        double entropy = 0.0;
        for (char c : charFrequency.keySet()) {
            double probability = (double) charFrequency.get(c) / totalCount;
            entropy -= probability * (Math.log(probability) / Math.log(2));
        }

        return entropy;
    }
}